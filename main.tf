provider "aws" {
    profile     = "default"
    region      = "eu-west-3"
}

data "aws_vpc" "default" {
  default = true
}

# La clé publique pour se connecter à notre future machine
resource "aws_key_pair" "key_pair" {
  public_key    = file(var.public_key_path)
  key_name      = "ssp3_prod_key"
  
}

# Groupe de sécurité autorisant l'accès SSH pour notre machine uniquement, ainsi qu'une connexion tcp sur port 3002 (api) et 80 (back-office) pour tout le monde
resource "aws_security_group" "security_group" {
  name        = "ssp3_security_group"
  description = "Security group created with terraform"
  vpc_id      = data.aws_vpc.default.id

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = [var.self_machine_ip]
  }

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 3002
    to_port     = 3002
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port       = 0
    to_port         = 0
    protocol        = "-1"
    cidr_blocks     = ["0.0.0.0/0"]
  }
}

# Création de l'instance AWS - machine Ubuntu 16.4
resource "aws_instance" "rs_instance_ssp3" {
    ami                 = "ami-051ebe9615b416c15"
    instance_type       = "t2.micro"
    key_name            = aws_key_pair.key_pair.key_name
    security_groups     = [aws_security_group.security_group.name]
    tags = {
      Name = "ssp3 prod server"
    }

    connection {
        type        = "ssh"
        user        = "ubuntu"
        private_key = file(var.private_key_path)
        host        = self.public_ip
    }
    
    # Copy script that install docker and docker-compose 
    provisioner "file" {
      source      = "setup-docker.sh"
      destination = "/tmp/setup-docker.sh"
    }

    # Write public ip in a file
    provisioner "remote-exec" {
      inline = [
        "sudo bash -c 'echo MACHINE_HOST=${self.public_ip} > /mypublicip'"
      ]
    }

    # Run script to install docker, docker-compose
    provisioner "remote-exec" {
      inline = [
        "chmod +x /tmp/setup-docker.sh",
        "/tmp/setup-docker.sh > /tmp/setup-docker-output",
      ]
    }
    
    # Copy script that launch the SSP3
    provisioner "file" {
      source      = "setup-ssp3-app.sh"
      destination = "/tmp/setup-ssp3-app.sh"
    }

    # Run script to launch SSP3
    provisioner "remote-exec" {
      inline = [
        "chmod +x /tmp/setup-ssp3-app.sh",
        "/tmp/setup-ssp3-app.sh > /tmp/setup-ssp3-app-output",
      ]
    }
}
