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

resource "aws_security_group" "dangerous_allow_all" {
  name        = "dangerous_allow_all"
  description = "Security group created with terraform"
  vpc_id      = data.aws_vpc.default.id

  ingress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
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
# Machine Back-office

resource "aws_instance" "ssp3_backoffice" {
    ami                 = "ami-051ebe9615b416c15"
    instance_type       = "t2.micro"
    key_name            = aws_key_pair.key_pair.key_name
    security_groups     = [aws_security_group.dangerous_allow_all.name]
    tags = {
      Name = "SSP3 - Back-office"
    }

    connection {
        type        = "ssh"
        user        = "ubuntu"
        private_key = file(var.private_key_path)
        host        = self.public_ip
    }
}

# Machine API 
resource "aws_instance" "ssp3_api" {
    ami                 = "ami-051ebe9615b416c15"
    instance_type       = "t2.micro"
    key_name            = aws_key_pair.key_pair.key_name
    security_groups     = [aws_security_group.dangerous_allow_all.name]
    tags = {
      Name = "SSP3 - API"
    }

    connection {
        type        = "ssh"
        user        = "ubuntu"
        private_key = file(var.private_key_path)
        host        = self.public_ip
    }
}

# Machine BDD MySQL
resource "aws_instance" "ssp3_dbmysql" {
    ami                 = "ami-051ebe9615b416c15"
    instance_type       = "t2.micro"
    key_name            = aws_key_pair.key_pair.key_name
    security_groups     = [aws_security_group.dangerous_allow_all.name]
    tags = {
      Name = "SSP3 - DBMySQL"
    }

    connection {
        type        = "ssh"
        user        = "ubuntu"
        private_key = file(var.private_key_path)
        host        = self.public_ip
    }
}
