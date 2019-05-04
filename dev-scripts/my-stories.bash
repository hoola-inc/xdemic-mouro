#!/bin/bash
PT_TOKEN=`cat .pt_token`
ME=`curl -s -X GET -H "X-TrackerToken: $PT_TOKEN" "https://www.pivotaltracker.com/services/v5/me"`
PROJECTS=`echo $ME | jq -c '.projects[]'`
USERNAME=`echo $ME | jq -r '.username'`
echo "Stories for $USERNAME"

IFS=$'\n'
for p in $PROJECTS; do
    PROJECT_ID=`echo $p | jq -r .project_id`
    PROJECT_NAME=`echo $p | jq -r .project_name`
    
    STORIES=`curl -s -X GET -H "X-TrackerToken: $PT_TOKEN" \
        "https://www.pivotaltracker.com/services/v5/projects/$PROJECT_ID/stories?filter=owned_by:$USERNAME%20AND%20-state:accepted" | jq -c '.[]'`
    
    echo "[$PROJECT_ID $PROJECT_NAME]"
    for s in $STORIES; do
        STORY_ID=`echo $s | jq -r '.id'`
        STORY_NAME=`echo $s  | jq -r '.name'`
        STORY_TYPE=`echo $s | jq -r '.story_type'`
        STORY_STATE=`echo $s | jq -r '.current_state'`
        echo " - [$STORY_TYPE/$STORY_ID] ($STORY_STATE): $STORY_NAME"
    done
done