# Salutations API (Hello World) Design Specifications


## Resources Listing Index

## A. Resource: v1/examples/hello
 
### 1. Method: GET Request
		
   Query Parameters: name

## B. Resource:  v1/examples/salutations

### 1. Method: GET Request
	
   Query Parameters: name, greeting, gender

### 2. Method: PUT Request
		
   Query Parameters: name, greeting, gender

### 3. Method: POST Request

   Query Parameters: None

## C. Resource:  v1/examples/{id}

### 1. Method: GET Request

   Query Parameters: None

### 2. Method: PUT Request

   Query Parameters: None

### 3. Method: DELETE Request

   Query Parameters: None

## Sample Data

salutations-data.json

{
   "salutations-data": [
      
     {
        "id": "0",
        "name": "World",
        "greeting": "Hello",
        "gender": "none"
      },
      
      {
        "id": "1",
        "name": "John",
        "greeting": "Hello",
        "gender": "male"
      },
      
      {
        "id": "2",
        "name": "Jane",
        "greeting": "Hello",
        "gender": "female"
      }
       
   ]

}


## A. Resource: v1/examples/hello 

### A1. Method: GET Request

Description: hello message, simplest request and response method.
		
Request Arguments
name (optional)

Returns message with query parameter input.

Request Example:

GET: http://api.mass.gov/v1/hello

GET: http://api.mass.gov/v1/examples/hello/?name=Matt

Response Example:

Success:
{
    "metadata": {
        "status": 200,
        "message": "OK",
        “error”: “No Errors”,
        "resultset": {   }
    },
    "requestInfo": {  },
    "results":
        {
            "message": "Hello World!"
        }
   
}

Errors:
"metadata": {
        "status": 400,
        "developerMessage”: “Bad Request.”,
        “userMessage”: “”,
        “errorCode”: “”,
        “moreInfo”: “”
}

"metadata": {
        "status": 500,
        "developerMessage”: “Internal Server Error.”,
        “userMessage”: “”,
        “errorCode”: “”,
        “moreInfo”: “”
}

## B. Resource: v1/examples/salutations 

### B1. Method: GET Request

Description: Returns listing from salutations data. Accepts filter by name, greeting, gender, message.
		
Request Arguments

name (optional)
Filters response by “name” query input parameter.

greeting (optional)
Filters response by “greeting” query input parameter.

gender (optional)
Filters response by “gender” query input parameter.

Request Example:

GET: http://api.mass.gov/v1/examples/salutations

GET: http://api.mass.gov/v1/examples/salutations/?name=Matt

GET: http://api.mass.gov/v1/examples/salutations/?greeting=Hello

GET: http://api.mass.gov/v1/examples/salutations/?gender=Male

GET: http://api.mass.gov/v1/examples/salutations/?name=Matt&greeting=Hello

Response Example:

Success:
{
    "metadata": {
        "status": 200,
        "message": "OK",
        “error”: “No Errors”,
        "resultset": {

  "count": 3,
            "offset": 0,
            "limit": 100



   }
    },
    "requestInfo": { 

“name” :  ” ”,
“greeting” : ” ”,
“gender” : ” ”


 },
    "results":
        {
  
  [
      
     {
        "id": "0",
        "name": "World",
        "greeting": "Hello",
        "gender": "none",
        "message": "Hello, World!"
      },
      
      {
        "id": "1",
        "name": "John",
        "greeting": "Hello",
        "gender": "male",
        "message": "Hello, Mr John"
      },
      
      {
        "id": "2",
        "name": "Jane",
        "greeting": "Hello",
        "gender": "female",
        "message": "Hello, Mrs Jane"
      }
       
   ]


        }
   
}

Errors:
"metadata": {
        "status": 400,
        "developerMessage”: “Bad Request.”,
        “userMessage”: “”,
        “errorCode”: “”,
        “moreInfo”: “”
}

"metadata": {
        "status": 500,
        "developerMessage”: “Internal Server Error.”,
        “userMessage”: “”,
        “errorCode”: “”,
        “moreInfo”: “”
}


### B2. Method: PUT Request

Description: Updates/Replaces salutations items. 		

Request Arguments

name (optional)
Filters update record set by “name” query input parameter.

greeting (optional)
Filters update record set by “greeting” query input parameter.

gender (optional)
Filters update record set by “gender” query input parameter.


Request Example:

PUT: http://api.mass.gov/v1/examples/salutations

PUT: http://api.mass.gov/v1/examples/salutations/?name=Matt

PUT: http://api.mass.gov/v1/examples/salutations/?greeting=Hello

PUT: http://api.mass.gov/v1/examples/salutations/?gender=Male

PUT: http://api.mass.gov/v1/examples/salutations/?name=Matt&greeting=Hello

Request Body Example:

{
    “name”: “Joe”
}

Response Example:

Success:
{
    "metadata": {
        "status": 200,
        "message": "OK",
        “error”: “No Errors”,
        "resultset": {

  "count": 3,
            "offset": 0,
            "limit": 100



   }
    },
    "requestInfo": { 

“name” :  ” ”,
“greeting” : ” ”,
“gender” : ” ”


 },
    "results":
        {
  
  [
      
     {
        "id": "0",
        "name": "Joe",
        "greeting": "Hello",
        "gender": "none",
        "message": "Hello, World!"
      },
      
      {
        "id": "1",
        "name": "Joe",
        "greeting": "Hello",
        "gender": "male",
        "message": "Hello, Mr Joe"
      },
      
      {
        "id": "2",
        "name": "Joe",
        "greeting": "Hello",
        "gender": "female",
        "message": "Hello, Mrs Joe"
      }
       
   ]


        }
   
}

Errors:
"metadata": {
        "status": 400,
        "developerMessage”: “Bad Request.”,
        “userMessage”: “”,
        “errorCode”: “”,
        “moreInfo”: “”
}

"metadata": {
        "status": 500,
        "developerMessage”: “Internal Server Error.”,
        “userMessage”: “”,
        “errorCode”: “”,
        “moreInfo”: “”
}


### B3. Method: POST Request

Description: Creates single salutation items. 		

Request Arguments

None

Request Example:

POST: http://api.mass.gov/v1/salutations


Request Body Example:

{
   “id” : 3 
   “name”: “Joe”,
    “greeting” : “Hello”,
   “gender” : “male”
}

Response Example:

Success:
{
    "metadata": {
        "status": 200,
        "message": "OK",
        “error”: “No Errors”,
        "resultset": {

  "count": 4,
            "offset": 0,
            "limit": 100



   }
    },
    "requestInfo": { 

“name” :  ” ”,
“greeting” : ” ”,
“gender” : ” ”


 },
    "results":
        {
  
         "id": "4",
        "name": "Joe",
        "greeting": "Hello",
        "gender": "male",
        "message": "Hello, Joe!"
      }
      
           
            
     
}

Errors:
"metadata": {
        "status": 400,
        "developerMessage”: “Bad Request.”,
        “userMessage”: “”,
        “errorCode”: “”,
        “moreInfo”: “”
}

"metadata": {
        "status": 500,
        "developerMessage”: “Internal Server Error.”,
        “userMessage”: “”,
        “errorCode”: “”,
        “moreInfo”: “”
}


## C. Resource: v1/examples/salutations/{id} 

### C1. Method: GET Request

Description: Returns data for single salutations item. 
		
Request Arguments

None

Request Example:

GET: http://api.mass.gov/v1/examples/salutations/{id}

GET: http://api.mass.gov/v1/examples/salutations/1

Response Example:

Success:
{
    "metadata": {
        "status": 200,
        "message": "OK",
        “error”: “No Errors”,
        "resultset": {

  "count": 3,
            "offset": 0,
            "limit": 100



   }
    },
    "requestInfo": {  },
    "results":
             
      {
        "id": "1",
        "name": "John",
        "greeting": "Hello",
        "gender": "male",
        "message": "Hello, Mr John"
      }
      
             
  
   
}

Errors:
"metadata": {
        "status": 400,
        "developerMessage”: “Bad Request.”,
        “userMessage”: “”,
        “errorCode”: “”,
        “moreInfo”: “”
}

"metadata": {
        "status": 500,
        "developerMessage”: “Internal Server Error.”,
        “userMessage”: “”,
        “errorCode”: “”,
        “moreInfo”: “”
}


### C2. Method: PUT Request

Description: Updates/Replaces data for a single salutation items. 		

Request Arguments

None

Request Example:

PUT: http://api.mass.gov/v1/examples/salutations/{id}

PUT: http://api.mass.gov/v1/examples/salutations/1


Request Body Example:

{
    “name”: “Sue”,
    “gender” : “female”    
}

Response Example:

Success:
{
    "metadata": {
        "status": 200,
        "message": "OK",
        “error”: “No Errors”,
        "resultset": {

  "count": 3,
            "offset": 0,
            "limit": 100



   }
    },
    "requestInfo": {  },
    "results":
        {
  
         "id": "1",
        "name": "Sue",
        "greeting": "Hello",
        "gender": "female",
        "message": "Hello, Sue!"
      }
      
}

Errors:
"metadata": {
        "status": 400,
        "developerMessage”: “Bad Request.”,
        “userMessage”: “”,
        “errorCode”: “”,
        “moreInfo”: “”
}

"metadata": {
        "status": 500,
        "developerMessage”: “Internal Server Error.”,
        “userMessage”: “”,
        “errorCode”: “”,
        “moreInfo”: “”
}

### C3. Method: DELETE Request

Description: Deletes single salutation item. 		

Request Arguments

None

Request Example:

DELETE: http://api.mass.gov/v1/examples/salutations/{id}

DELETE: http://api.mass.gov/v1/examples/salutations/1

Response Example:

Success:
{
    "metadata": {
        "status": 200,
        "message": "OK",
        “error”: “No Errors”,
        "resultset": {

  "count": 2,
            "offset": 0,
            "limit": 100



   }
    },
    "requestInfo": {  },
    "results":
        {  
         "id": "1",
        "name": "Sue",
        "greeting": "Goodbye",
        "gender": "female",
        "message": "Goodbye, Sue!"
      }
      
           
            
     
}

Errors:
"metadata": {
        "status": 400,
        "developerMessage”: “Bad Request.”,
        “userMessage”: “”,
        “errorCode”: “”,
        “moreInfo”: “”
}

"metadata": {
        "status": 500,
        "developerMessage”: “Internal Server Error.”,
        “userMessage”: “”,
        “errorCode”: “”,
        “moreInfo”: “”
}

