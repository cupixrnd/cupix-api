# Invitation API

Let's say you want to invite with user emails. When invitations are sent, users can create an account through the email they receive. However, the invited users may be granted to permission before creating an account. This document is explained that the series of processes of inviting users, putting them into groups, and granting permissions through the API.

Here, I will divide the case of sharing a project and the case of inviting users and adding them with administrator permission.

#### Sharing only project

1. [Invite users to your team.](#invite-to-team)
2. [Find the ids of the invited users.](#find-group_id-to-put-user_id-in)
3. [Grant Project-Admin permission to users.](#add-a-user-to-a-specific-group)
4. [Share permission "F" on the project to users.](#share-permission-to-users-on-the-facility)

#### Invite users as administrators

1. [Invite users to your team.](#invite-to-team)
2. [Find the ids of the invited users.](#find-group_id-to-put-user_id-in)
3. [Grant Administrator permission to users.](#add-a-user-to-a-specific-group)

These steps are necessary to open the **Capture Editor**. If you share only a project to new user, he can open the capture editor of that project, and if you grant Administrator to new user, he can open the capture editor of all projects.

## Invite to team

`POST https://api.cupix.works/api/v1/teams/invitation`

| Attribute   | Type            | Required | Description                                                    |
| :---------- | :-------------- | :------- | :------------------------------------------------------------- |
| fields      | array of string | true     | The field to receive as a response. pinned to user_emails here |
| user_emails | array           | true     | user email to invite                                           |

<br>

### Sample request

```js
request.post(`https://api.cupix.works/api/v1/teams/invitation`, {
        method: 'POST',
        json: true,
        accept: 'application/json',
	qs: {
            fields: 'user_emails'
        },
        body: {
            user_emails:["test@cupix.com", "test2@cupix.com"]
        },
	headers: {
            'x-cupix-auth': <your_access_token>
        }
    })
```

### Example response

```
Status Code 200 : {
  "result": {
    "user_emails": [
      "test@cupix.com", "test2@cupix.com"
    ]
  },
  "session": null,
  "message": null
}
```

<br>

## Find user_id by email

`GET https://api.cupix.works/api/v1/users/find_by_email`

| Attribute | Type            | Required | Description                                                                 |
| :-------- | :-------------- | :------- | :-------------------------------------------------------------------------- |
| fields    | array of string | true     | id, state, last_sign_in_at, avatar_urls, firstname, lastname, locale, email |
| email     | string          | true     | Email to find user_id                                                       |

### Sample request

```js
request.get(`https://api.cupix.works/api/v1/users/find_by_email`, {
        method: 'GET',
        json: true,
        accept: 'application/json',
	qs: {
            fields: 'id', email: 'test@cupix.com'
        },
	headers: {
            'x-cupix-auth': <your_access_token>
        }
    })
```

### Example response

```
Status Code 200 : {
  "result": {
    "data": {
      "id": "1234",
      "type": "user",
      "attributes": {
        "id": 1234
      }
    }
  },
  "session": null
}
```

## Find group_id to put user_id in

`GET https://api.cupix.works/api/v1/groups`

| Attribute | Type            | Required | Description                                                           |
| :-------- | :-------------- | :------- | :-------------------------------------------------------------------- |
| fields    | array of string | true     | id, name, group_type, user, team, users_count, created_at, updated_at |
| page      | integer         | false    | page index to search per page                                         |
| per_page  | integer         | false    | Number of items to GET per page                                       |

### Sample request

```js
request.get(`https://api.cupix.works/api/v1/groups`, {
        method: 'GET',
        json: true,
        accept: 'application/json',
	qs: {
            fields: 'id, name'
        },
	headers: {
            'x-cupix-auth': <your_access_token>
        }
    })
```

### Example responses

```
Status Code 200 : {
  "result": {
    "data": [
        {
        "id": "3953",
        "type": "group",
        "attributes": {
          "id": 3953,
          "name": "Project Admin"
        }
      },
      {
        "id": "4",
        "type": "group",
        "attributes": {
          "id": 4,
          "name": "Users"
        }
      },
      {
        "id": "3",
        "type": "group",
        "attributes": {
          "id": 3,
          "name": "Administrators"
        }
      },
      {
        "id": "2",
        "type": "group",
        "attributes": {
          "id": 2,
          "name": "Billing Admin"
        }
      },
      {
        "id": "1",
        "type": "group",
        "attributes": {
          "id": 1,
          "name": "Super Admin"
        }
      }
    ],
    "pagination": {
      "total_entries": 5,
      "total_pages": 1,
      "per_page": 30,
      "previous_page": null,
      "current_page": 1,
      "next_page": null
    }
  },
  "session": null
}
```

<br>

## Add a user to a specific group

`PUT https://api.cupix.works/api/v1/groups/{id}/add_users`

| Attribute | Type            | Required | Description                                                    |
| :-------- | :-------------- | :------- | :------------------------------------------------------------- |
| fields    | array of string | true     | id,name,group_type,user,team,created_at,updated_at,users_count |
| id        | integer         | true     | Group ID                                                       |
| user_ids  | array           | false    | Array of user_ids to add to the group                          |

<br>

### Sample request

```js
request.put(`https://api.cupix.works/api/v1/groups/{id}/add_users`, {
        method: 'PUT',
        json: true,
        accept: 'application/json',
	qs: {
            fields: 'id, name'
        },
	body: {
	    user_ids: [<user id>, <user id>, ...]
	},
	headers: {
            'x-cupix-auth': <your_access_token>
        }
    })
```

### Example response

```js
Status Code 200 : {
  "result": {
    "data": {
      "id": "1234",
      "type": "group",
      "attributes": {
        "firebase": {
          "key": ""
        },
        "id": 1234,
        "name": "Project Admin",
        "group_type": {
          "id": 16,
          "name": "Project Administrators",
          "code": "facility_administrators",
          "code_id": 8,
          "visible": true,
          "maximum_user_count": null
        },
        "user": {
          "id": null
        },
        "team": {
          "id": 1
        },
        "users_count": 7,
        "cycle_state": "created",
        "cycle_state_updated_at": null,
        "cycle_state_updated_by": {
          "id": null
        },
        "sign_in_methods": [
          "email",
          "procore",
          "azure"
        ]
      }
    }
  },
  "session": null
}

```

<br>

## Share permission to users on the facility

`PUT https://api.cupix.works/api/v1/facilities/{key}/share`

| Attribute         | Type            | Required | Description                                                                                 |
| :---------------- | :-------------- | :------- | :------------------------------------------------------------------------------------------ |
| fields            | array of string | true     | id,email,firstname,lastname,avatar_urls,type,permission,user,group,state,inheritedFrom      |
| key               | string          | true     | facility_key to share                                                                       |
| user_ids          | array           | false    | Array of user ids to share the facility                                                     |
| group_ids         | array           | false    | Array of group ids to share the facility                                                    |
| emails            | array           | false    | Array of user emails to share the facility, Server automatically sends invitation to emails |
| permission        | string          | false    | What kind of permission to share, ex) "F"(Full), "RUC", "RC", "R"                           |
| send_notification | boolean         | false    | Whether to send notification email                                                          |
| message           | string          | false    | Message to write in notification email                                                      |

### Sample request

```js
request.put(`https://api.cupix.works/api/v1/facilities/{key}/share`, {
        method: 'PUT',
        json: true,
        accept: 'application/json',
	qs: {
            fields: 'id,email,firstname,lastname,avatar_urls,type,permission,user,group,state,inheritedFrom'
        },
	body: {
	    emails: [],
		group_ids: [],
		permission: "F",
		send_notification: false,
		user_ids: [1234]

	},
	headers: {
            'x-cupix-auth': <your_access_token>
        }
    })
```

### Example response

```js
Status Code 200 : {
  "result": {
    "data": [
      {
        "id": null,
        "type": "member",
        "attributes": {
          "type": "User",
          "user": {
            "id": 1234,
            "email": "test@cupix.com",
            "firstname": "test",
            "lastname": "lee",
            "avatar_urls": {},
            "locale": null,
            "state": "active"
          },
          "permission": "F"
        }
      }
    ],
    "pagination": null
  },
  "session": null
}
```
