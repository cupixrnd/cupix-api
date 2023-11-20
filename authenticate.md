# Authenticate

`POST https://api.cupix.works/api/v1/authenticate`

User could be issued an access_token through authentication, and this token should be value of **x-cupix-auth** key included in the header of almost every request.

Only two methods are described:

1. [authentication with email and password](#authenticate-with-email)
2. [re-authentication with refresh_token received during authentication.](#authenticate-with-refresh_token)

**The issued _access_token_ can be used for 30 minutes and can be reissued and renewed through _refresh_token_. <br>
_refresh_token_ can be used for a week without renewing.**

| Attribute     | Type            | Required | Description                                                                    |
| :------------ | :-------------- | :------- | :----------------------------------------------------------------------------- |
| fields        | array of string | true     | id,access_token,refresh_token,access_token_expires_at,refresh_token_expires_at |
| grant_type    | string          | false    | email, refresh_token                                                           |
| team_domain   | string          | false    | domain to authenticate                                                         |
| email         | string          | false    | email which user sign in with                                                  |
| password      | string          | false    | password which user sign in with                                               |
| refresh_token | string          | false    | refresh_token received during authentication                                   |

<br>

## Authenticate with email

### Sample Request

```js
request.post(`https://api.cupix.works/api/v1/authenticate`, {
    method : 'POST',
    json : true,
    accept: 'application/json',
    body: {
        grant_type: 'email',
        team_domain : <Your domain>,
        email : <Your email>,
        password : <Your password>'
    }
})
```

### Example responses

```js
{
  "result": {
    "grant_type": "email",
    "access_token": <ACCESS_TOKEN_VALUE>,
    "access_token_expires_at": "",
    "refresh_token": <REFRESH_TOKEN_VALUE>,
    "refresh_token_expires_at": "",
    "session_id": ""
  },
  "session": {
    "firebase": {
      ""
    },
    "user": {
		...
    },
    "team": {

    },
    "grant_type": "email",
    "created_at": "",
    "updated_at": "",
    "expires_at": "",
    "session_id": ""
  },
  "message": null
}
```

## Authenticate with refresh_token

### Sample Request

```js
request.post(`https://api.cupix.works/api/v1/authenticate`, {
    method : 'POST',
    json : true,
    accept: 'application/json',
    body: {
        grant_type: 'refresh_token',
        team_domain :  <Your domain>,
        refresh_token :  <Your REFRESH_TOKEN_VALUE>'

    }
})
```

### Example response

```js
{
  "result": {
    "grant_type": "refresh_token",
    "access_token": <ACCESS_TOKEN_VALUE>,
    "access_token_expires_at": "",
    "refresh_token": <REFRESH_TOKEN_VALUE>,
    "refresh_token_expires_at": "",
    "session_id": ""
  },
  "session": {
    "firebase": {
      ""
    },
    "user": {
		...
    },
    "team": {

    },
    "grant_type": "refresh_token",
    "created_at": "",
    "updated_at": "",
    "expires_at": "",
    "session_id": ""
  },
  "message": null
}
```
