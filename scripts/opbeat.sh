curl https://intake.opbeat.com/api/v1/organizations/ea3776fa17c44d5b8d8de26870279506/apps/8612f8acdc/releases/ \
-H "Authorization: Bearer 5b6e1ffdc35d7de47105a3ce7c4d8384712954d1" \
-d rev=`git log -n 1 --pretty=format:%H` \
-d branch=`git rev-parse --abbrev-ref HEAD` \
-d status=completed
