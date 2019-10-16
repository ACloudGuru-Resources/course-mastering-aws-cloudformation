


```yaml
files:
  /etc/cfn/hooks.d/cfn-auto-reloader.conf:
    content: !Sub |
      [cfn-auto-reloader-hook]
      triggers=post.update
      path=Resources.EC2.Metadata.AWS::CloudFormation::Init
      action=/opt/aws/bin/cfn-init -v --stack ${AWS::StackName} --resource EC2Instance --configsets partial_install --region ${AWS::Region}
    mode: "000400"
    owner: root
    group: root
  /etc/cfn/cfn-hup.conf:
    content: !Sub |
      [main]
      stack=${AWS::StackId}
      region=${AWS::Region}
      verbose=true
      interval=5
    mode: "000400"
    owner: root
    group: root
```
