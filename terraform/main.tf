provider "aws" {
  region = "ap-south-1"
}

resource "aws_key_pair" "kanban_key" {
  key_name   = "kanban-key"
  public_key = file("~/.ssh/id_rsa.pub")
}

resource "aws_security_group" "kanban_sg" {
  name        = "kanban-sg"
  description = "Allow SSH, HTTP, Jenkins"

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 8080
    to_port     = 8080
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_instance" "kanban_vm" {
  ami                    = "ami-0f5ee92e2d63afc18"   # Ubuntu 22.04 ap-south-1
  instance_type          = "t3.medium"
  key_name               = aws_key_pair.kanban_key.key_name
  vpc_security_group_ids = [aws_security_group.kanban_sg.id]

  tags = {
    Name = "kanban-devops-vm"
  }

  provisioner "remote-exec" {
    inline = [
      "echo 'EC2 is ready for Ansible...'"
    ]

    connection {
      type        = "ssh"
      user        = "ubuntu"
      private_key = file("~/.ssh/id_rsa")
      host        = self.public_ip
    }
  }
}

resource "null_resource" "ansible" {
  depends_on = [aws_instance.kanban_vm]

  provisioner "local-exec" {
    command = <<EOT
ANSIBLE_HOST_KEY_CHECKING=False ansible-playbook \
  -i '${aws_instance.kanban_vm.public_ip},' \
  --user ubuntu \
  --private-key ~/.ssh/id_rsa \
  ../ansible/playbook.yml
EOT
  }
}

output "public_ip" {
  value = aws_instance.kanban_vm.public_ip
}
