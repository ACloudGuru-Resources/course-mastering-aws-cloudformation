#!/bin/bash
export GHOSTDIR=/var/www/ghost
export MAIL_PWD=`(echo -en '\x02'; echo -n 'SendRawEmail' | openssl dgst -sha256 -hmac ${GhostSesUserAccessKey.SecretAccessKey} -binary) | openssl enc -base64`
(id ghostuser > /dev/null 2>&1 && echo ghostuser exists...)   || (useradd --user-group --create-home ghostuser && echo creating ghostuser...)
( [[ `groups ghostuser | awk '{print $4}'` == sudo ]] && echo ghostuser has sudo access...)   || (usermod -aG sudo ghostuser && echo giving ghostuser sudo access...)
( [[ -f /etc/sudoers.d/ghostuser ]] && echo ghostuser can execute sudo w/o password)   || (echo 'ghostuser ALL=(ALL:ALL) NOPASSWD: ALL' > /etc/sudoers.d/ghostuser && echo allowing ghostuser to execute sudo w/o password as required by cli...)
(node -v > /dev/null 2>&1 && echo node installed...)   || (curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash && echo node repo configured)
node -v > /dev/null 2>&1   || (sudo apt-get install -y nodejs && echo node installed)
(ghost version && echo ghost present...)   || (sudo npm install ghost-cli@latest -g && echo ghost installed...)
( [[ -d $GHOSTDIR ]] && echo $GHOSTDIR directory exists...)   || (sudo mkdir -p $GHOSTDIR && echo ghost app directory created)
( [[ `stat -c %U $GHOSTDIR` == ghostuser ]] && [[ `stat -c %G $GHOSTDIR` == ghostuser ]] && echo $GHOSTDIR ownership correct...)   || (sudo chown ghostuser:ghostuser $GHOSTDIR && echo ghost ownership set...)
( [[ `stat -c %a $GHOSTDIR` == 775 ]] && echo $GHOSTDIR permissions correct...)   || (sudo chmod 775 $GHOSTDIR && echo $GHOSTDIR permissions set...)
if [[ -f config.production.json ]]; then
echo ghost present...
else
echo ghost not present, installing...
su - ghostuser -c "cd /var/www/ghost && ghost install --verbose --url https://${DomainName} --ip 0.0.0.0 --dbhost ${GhostDbInstance.Endpoint.Address} --dbuser ${DbUser} --dbpass ${DbPassword} --dbname ${DbName} --mail SMTP --mailuser ${GhostSesUserAccessKey} --mailpass $MAIL_PWD --mailhost ${SesSmtpEndpoint} --mailport 587 --sslemail ${SslEmail} --process systemd --no-prompt --auto"
su - ghostuser -c "cd $GHOSTDIR && ghost config mail.from ${FromAddress}"
if [ -f $GHOSTDIR/system/files/www.${DomainName}.conf ]; then
echo SSL for www configured...
else
echo generating cert and configuring nginx for www...
su - ghostuser -c "cd $GHOSTDIR && ghost config url https://www.${DomainName}"
su - ghostuser -c "cd $GHOSTDIR && ghost setup nginx ssl --sslemail ${SslEmail}"
su - ghostuser -c "cd $GHOSTDIR && ghost config url https://${DomainName}"
awk '!/proxy_set_header/' $GHOSTDIR/system/files/www.${DomainName}.conf > /tmp/www.${DomainName}.conf
awk '!/proxy_set_header/' $GHOSTDIR/system/files/www.${DomainName}-ssl.conf > /tmp/www.${DomainName}-ssl.conf
sed -i 's/proxy_pass.*/return 301 https:\/\/${DomainName}\$request_uri;/' /tmp/www.${DomainName}.conf
sed -i 's/proxy_pass.*/return 301 https:\/\/${DomainName}\$request_uri;/' /tmp/www.${DomainName}-ssl.conf
mv /tmp/www.${DomainName}.conf $GHOSTDIR/system/files/www.${DomainName}.conf
mv /tmp/www.${DomainName}-ssl.conf $GHOSTDIR/system/files/www.${DomainName}-ssl.conf
chown ghostuser:ghostuser $GHOSTDIR/system/files/www.${DomainName}.conf
chown ghostuser:ghostuser $GHOSTDIR/system/files/www.${DomainName}-ssl.conf
nginx -t
nginx -s reload
fi
su - ghostuser -c "cd $GHOSTDIR && ghost restart"
fi
