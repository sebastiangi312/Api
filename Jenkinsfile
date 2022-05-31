pipeline {
    agent any
    
    tools{
        nodejs "NodeJS"
    }
    stages {
        
        stage('Cloning Repo') {
            steps {
                checkout scm
            }
        }

        stage('Configuring Node'){
            steps {
                sh 'apt update -y'
                sh 'apt install -y'
                sh 'npm install'
            }
        }

        stage('Run test'){
            steps {
                sh 'npm run test'
            }
        }
    }
}