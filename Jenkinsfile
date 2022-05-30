pipeline {
    agent any
    tools{
        dockerTool  'mydocker'
    }
    stages {
        
        
        stage('Cloning Repo') {
            steps {
                checkout scm
            }
        }
        
    }
}