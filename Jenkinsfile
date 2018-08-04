node {

    // ~~~ Build Configuration

    // Code repo
    def repo = 'https://github.com/jamiejackson/eagle.git'
    def branch = 'build-in-docker'

    // Container
    def name = 'eagle'

    // ~~~ Build Environment

    // Cluster name is used to label resources to differentiate between deployments
    def cluster = sh (script: 'cat /etc/ecs/ecs.config | sed s/ECS_CLUSTER=//', returnStdout: true).trim()

    // Query the EC2 metadata service and return the current AWS region in which we're running
    def region = sh (script: 'curl -s http://169.254.169.254/latest/dynamic/instance-identity/document | jq -r .region', returnStdout: true).trim()

    // Name of the image including the ECR repo
    def image = "${awsIdentity().account}.dkr.ecr.${region}.amazonaws.com/${name}-${cluster}"

    stage('Preparation') {
        git url: repo, branch: branch
    }

    stage('Build Image') {
      dir(name) {
		sh "sudo docker build -t ${name}:${env.BUILD_ID} -f ./container/Dockerfile ."
		println "pull analysis reports from docker build stage image"
		sh 'build_stage_image_id=`sudo docker images --filter "label=test=true" -q`'
		sh 'sudo docker tag $build_stage_image_id analysis_reports'
		sh 'sudo docker run --rm --name analysis_reports -d analysis_reports'
		sh "sudo docker cp analysis_reports:/app/build/reports $WORKSPACE/analysis_reports"
		sh "sudo docker stop analysis_reports"
		sh "sudo docker rm analysis_reports"
      }
    }

    stage('Push Image') {
        sh "aws configure set default.region ${region}"
        sh "sudo \$(aws ecr get-login --no-include-email)"
        sh "sudo docker tag ${name}:${env.BUILD_ID} ${image}:${env.BUILD_ID}"
        sh "sudo docker tag ${name}:${env.BUILD_ID} ${image}:latest"
        sh "sudo docker push ${image}:${env.BUILD_ID}"
        sh "sudo docker push ${image}:latest"
    }

    stage('Deploy Container') {
        sh "aws ecs update-service --cluster ${cluster} --service ${name} --force-new-deployment"
    }
}
