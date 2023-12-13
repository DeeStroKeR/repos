# Vendor Registration Process

### Credentials

**baseUrl**: https://installer.a1apps.io

**Authorization Type**: Header

| **key** | **value** |
| ----------- | ------- |
| x-api-key | apiKeyValue |

[![Authorization and Variables](https://i.postimg.cc/Vkzqc5nY/Screenshot-2023-05-16-at-18-25-46.png)](https://postimg.cc/ZCDB8bwg)

### Registration Steps

1. Register a vendor via a `POST` request to `{{baseUrl}}/vendors`. This method is open and doesn't require authorization. The request body should be in the following format:

```json
    {
      "companyName": "your company name (REQUIRED)",
      "email": "your email address (REQUIRED)",
      "phoneNumber": "your phone number (optional)",
      "contactName": "your company contact name (optional)"
    }
```

You will receive the API key in the response. Save this key since you will need it to access further methods. 

```json
{
    "APIKeyValue": "your_personal_API_key"
}
```

For the next steps, add this API key to your x-api-key header. You can test it by viewing your vendor information via a `GET` request to `{{baseUrl}}/vendors/:vendorEmail`. Replace `:vendorEmail` with the email you used to register the vendor.

2. Register your first vendor application using the `POST` request to `{{baseUrl}}/vendors/:vendorEmail`. Replace `:vendorEmail` with the email you used to register the vendor. The request body should be in the following format:

```json
{
  "appName": "Application name",
  "appSourceType": "url|s3|git",
  "appSourceUrl": "https://link_to_application_source.com",
  "appVersion": "Application version",
  "appConfig": {
    "aliasName": "Application alias",
    "bodyParameters": [
      "Array of application bodyParameters or empty array",
      "Array of application bodyParameters or empty array"
    ],
    "frontendSource": {
      "path": "Path to source frontend code",
      "framework": "Framework for frontend"
    },
    "visibility": "public|hidden",
    "appName": "application name",
    "description": "application description",
    "configParameters": [
      "Array of application configParameters or empty array",
      "Array of application configParameters or empty array"
    ],
    "type": "business|developer|internal",
    "backendSource": {
      "path": "Path to source backend code",
      "framework": "Framework for backend"
    },
    "dependencies": [
      {
        "appName": "dependency application name. Example: cloud-git",
        "companyName": "dependency companyName owner."
      },
      {
        "appName": "dependency application name. Example: cloud-git",
        "companyName": "dependency companyName owner."
      }
    ],
    "tags": [
      "Array of application tags or empty array",
      "Array of application tags or empty array"
    ]
  }
}
```

Here's the detailed description of the request body: 

 - **appName** - the name of your application. It will be treated as application id and must be unique. You can only use latin letters `(A-Z, a-z)` and underscores `_` in the name. 
 - **appSourceType** - the type of your application source. Right now, only `url` is supported.
 - **appSourceUrl** - the url of your application source. Please make sure that your application source is available for downloading.
 - **appVersion** - the version of your application. It can be any string. When registering the application, please add your `main` version to the body. To register other versions, use update application request.
 - **appConfig** - the configuration of your application. It contains the following fields:
   - **aliasName** - the alias of your application. It will be used as a part of the url to access your application and displayed as its name in the UI. The alias name should only consist of letters `(A-Z, a-z)`, numbers `(0-9)`, and the following symbols: `-`, `_`, and `.`.
   - **bodyParameters** - the list of optional environmental variables needed to install your application. To ensure smooth user experience, add `host` and `user` to your body parameters. This will allow your application to be installed on customer home portal.
   - **frontendSource** - the source of your frontend. It contains the following fields:
     - **path** - the path to your frontend source folder. For example, `/react-site`.
     - **framework** - the framework used in your frontend. Allowed value is `React`.
   - **visibility** - the visibility of your application. It can be `public` or `hidden`. If it's hidden, the users will not be able to see on their home page.
   - **appName** - the name of your application. 
   - **description** - the description of your application. It will be displayed in the UI.
   - **configParameters** - the list of required environmental variables needed to install your application.
   - **type** - the type of your application. It can be `business`, `developer` or `internal`. This influences the category your application will be displayed in.
   - **backendSource** - the source of your backend. It contains the following fields:
     - **path** - the path to your backend source folder. For example, `/server`.
     - **framework** - the framework used in your backend. Allowed values are `aws-cdk` and `serverless`.
   - **dependencies** - the list of other applications that your application may depend on (add `cloud-users` if your application will use our platform's cognito authentication).
     - **appName** - the name of the application your application depends on.
     - **companyName** - the name of the company that owns the application your application depends on. For Tibica applications, e.g., cloud-users or cloud-git, use `Tibica` as the company name.
   - **tags** - the list of tags that can be added to the users your application, e.g., `ADMIN`, `EDITOR`, etc.. 

If everything went successfully, you will get the following response:
```json
{
    "message": "Application created successfully"
}
```

3. You can check the latest info regarding your application by sending a `GET` request to `{{baseUrl}}/vendors/:vendorEmail/:applicationName`. Replace `:vendorEmail` with the email you used to register the vendor and `:applicationName` with the name of your application.

4. To notify the customers that there was update or register a different version of your application, send a `PUT` request to `{{baseUrl}}/vendors/:vendorEmail/:applicationName`. Replace `:vendorEmail` with the email you used to register the vendor and `:applicationName` with the name of your application. The request body should be in the following format:

```json
{
  "appSourceUrl": "https://link_to_application_source.com",
  "appVersion": "Application version",
  "hasUpdate": true|false
}
```

There is a new field in the request body - **hasUpdate**. It is used to notify the customers that there was an update of your application. When set to `true`, the customers will see the update button on the application card on their home page.

If everything went successfully, you will get an empty response with status code 200.

5. If you wish to change any of the application parameters, you can send a `PUT` request to `{{baseUrl}}/vendors/:vendorEmail/:applicationName`. Include the full body this time, which differs from the `POST` request only by the `hasUpdate` field. The request body should be in the following format: 

```json
{
  "appSourceUrl": "https://link_to_application_source.com",
  "appVersion": "Application version",
  "hasUpdate": true,
  "appConfig": {
    "aliasName": "application alias",
    "bodyParameters": [
      "Array of application bodyParameters or empty array",
      "Array of application bodyParameters or empty array"
    ],
    "frontendSource": {
      "path": "Path to source frontend code",
      "framework": "Framework for frontend"
    },
    "visibility": "public|hidden",
    "appName": "application name",
    "description": "application description",
    "configParameters": [
      "Array of application configParameters or empty array",
      "Array of application configParameters or empty array"
    ],
    "type": "business|developer|internal",
    "backendSource": {
      "path": "Path to source backend code",
      "framework": "Framework for backend"
    },
    "dependencies": [
      {
        "appName": "dependency application name. Example: cloud-git",
        "companyName": "dependency companyName owner."
      },
      {
        "appName": "dependency application name. Example: cloud-git",
        "companyName": "dependency companyName owner."
      }
    ],
    "tags": [
      "Array of application tags or empty array",
      "Array of application tags or empty array"
    ]
  }
}
```

Please note, that you cannot change `appName`, so make sure it is the same as the one you used to register the application.