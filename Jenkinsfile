pipeline {
    agent any
    tools{
        dockerTool  'mydocker'
    }
    stages {
        stage('Cleaning previous containers') {
            steps {
                sh '(docker ps -aq | xargs docker stop | xargs docker rm) | true'
                sh 'docker system prune -af'
                sh '(docker volume rm $(docker volume ls -q)) | true'
            }
        }
        
        stage('Cloning Repo') {
            steps {
                checkout scm
            }
        }
        
    }
}