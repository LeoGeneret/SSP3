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

#
# SECURITY GROUPS
#

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

resource "aws_security_group" "ssp3_database_security" {
  name        = "ssp3_database_security"
  description = "Security group created with terraform"
  vpc_id      = data.aws_vpc.default.id

  ingress {
    from_port   = 3306
    to_port     = 3306
    protocol    = "tcp"
    cidr_blocks = [var.LOCAL_MACHINE_IP]
    security_groups = [
      aws_security_group.ssp3_classic_access.id
    ]
  }

  ingress {
    from_port   = 8080
    to_port     = 8080
    protocol    = "tcp"
    cidr_blocks = [var.LOCAL_MACHINE_IP]
  }

  ingress {
    from_port   = 22
    to_port     = 22
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

resource "aws_security_group" "ssp3_classic_access" {
  name        = "ssp3_classic_access"
  description = "Security group created with terraform"
  vpc_id      = data.aws_vpc.default.id

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 22
    to_port     = 22
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

resource "aws_security_group" "ssp3_haproxy_access" {
  name        = "ssp3_haproxy_access"
  description = "Security group created with terraform"
  vpc_id      = data.aws_vpc.default.id

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 8080
    to_port     = 8080
    protocol    = "tcp"
    cidr_blocks = [var.LOCAL_MACHINE_IP]
  }

  ingress {
    from_port   = 22
    to_port     = 22
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

#
# INSTANCES
#

# Machine Back-office

resource "aws_instance" "ssp3_backoffice" {
    ami                 = "ami-051ebe9615b416c15"
    instance_type       = "t2.micro"
    key_name            = aws_key_pair.key_pair.key_name
    security_groups     = [aws_security_group.ssp3_classic_access.name]
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
    count               = 2
    instance_type       = "t2.micro"
    key_name            = aws_key_pair.key_pair.key_name
    security_groups     = [aws_security_group.ssp3_classic_access.name]
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

# Machine HAPROXY - API 
resource "aws_instance" "ssp3_haproxy_api" {
    ami                 = "ami-051ebe9615b416c15"
    instance_type       = "t2.micro"
    key_name            = aws_key_pair.key_pair.key_name
    security_groups     = [aws_security_group.ssp3_haproxy_access.name]
    tags = {
      Name = "SSP3 - HAPROXY - API"
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
    security_groups     = [aws_security_group.ssp3_database_security.name]
    tags = {
      Name = "SSP3 - Database MySQL"
    }

    connection {
        type        = "ssh"
        user        = "ubuntu"
        private_key = file(var.private_key_path)
        host        = self.public_ip
    }
}
