REGION := ap-northeast-1
PREFIX := chrome-tor
ENV := development
PROFILE := default


s3:
	aws cloudformation validate-template \
		--template-body file://cfn-templates/s3.yml && \
	aws cloudformation deploy \
		--template-file ./cfn-templates/s3.yml \
		--stack-name $(PREFIX)-$(ENV)-s3 \
		--profile $(PROFILE) \
		--region $(REGION) \
		--parameter-overrides \
		Prefix=$(PREFIX) \
		Environment=$(ENV)

