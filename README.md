# NJIT School Assignment

## Local Setup 
- clone the repo
- create a virtual environment (Follow any one of the three depending on your local system)
   
    - https://www.geeksforgeeks.org/creating-python-virtual-environment-windows-linux/ (for pip)
    - for anaconda 
        ```
        conda create -n myenv python=3.7
        conda activate myenv
        ``` 
    -   
        ```
        python3 -m venv env
        source env/bin/activate
        ```
    

- install python dependencie : 
```
pip install -r requirements.txt
```
- Generate frontend build folder (if not there)
```
npm install
npm run build
```
- Configure Database URI in .env file (if not present)
```
DB_URI=<your database URI>
```

- run : 
```
python app.py
```

## For Customising frontend 
- install npm dependencies : 
```
npm install
```
- make changes in src file
- build : 
```
npm run build
```
- to see change just re run the server  in root directory of repository. 
```
python app.py
``` 

## Server
- server will run in http://localhost:8081

---

## Problems known in this project
- The server once started it only adds the the new users to the global variable but also if a user leaves the game it should remove that user from list. That's why the first teo players to join the server can only play others will join as spectator. In time had permitted I would have detected the event when user leaves a game an would emit appropriate signal to server. 
- Also the event emission are restricted from the client side and are not verified at server. So if some user pings at the given socket endpoint it will cause unexpected behaviour in the game. To handle this server side verification is needed and had to define server code logic too.
- Currently I am storing username and their score. So if two different players login with same username there will be a problem as both players will be sharing the same score. As a result the updation of corresponding player score will be incorrect. To address this problem we can have a password option so that each user score will remain protected.
## Technical Issues faced
- Deployment issue : On deploying the app to heroku the socket connection is breaking contineuouly and unable to make any communication between server and client. This may have happened due to either gunicorn webserver which mayn't be compatible with socketio connection.
- Integrating database with backend. It had an issue while connecting to Heroku database and writing the first row. This was solved later I found that first I need to create a table then can read write to the database. Database is currently online one of heroku postgresql.
- Managing the user scores after a game play was initially little difficult for me. Need to figure out who was player X and player Y and update the score accordingly. To solve this I stored the player names in two variables and updated the score accordingly.
<br> 
<b>
sources : stackoverflow, Experimenting, Heroku database documentation and Brainstorming.
</b> 

## Future Improvement
- Making rooms so that multiple group of students can play simultaneously
- Also having ability to make any two spectator as players so that spectator can also play the game.

## Extra Features
- Multiple user of same username cannot login to a same game. (To handle undesired manipulation of database).
- Filter by name feature added in the leaderboard.
- Previous Game records in a database.

---

# Testing Code

## Update the main branch
```
git pull origin main
```

## Pylint
Ignoring the non-captilization of variables name and other minor issues
```
pylint -d C0303,C0413,E1101,W1508,R0903,W0603,C0103 app.py
```

## Eslint
```
npx eslint src/components/
``` 

# Other information

## Dependencies
- backend - Python Flask
    ```
    astroid==2.5.1
    bidict==0.21.2
    certifi==2020.12.5
    click==7.1.2
    colorama==0.4.4
    Flask==1.1.2
    Flask-Cors==3.0.10
    Flask-SocketIO==5.0.1
    Flask-SQLAlchemy==2.4.4
    gunicorn==20.0.4
    isort==5.7.0
    itsdangerous==1.1.0
    Jinja2==2.11.3
    lazy-object-proxy==1.5.2
    MarkupSafe==1.1.1
    mccabe==0.6.1
    psycopg2==2.8.6
    pylint==2.7.2
    python-dotenv==0.15.0
    python-engineio==4.0.0
    python-socketio==5.0.4
    six==1.15.0
    SQLAlchemy==1.3.23
    toml==0.10.2
    typed-ast==1.4.2
    Werkzeug==1.0.1
    wincertstore==0.2
    wrapt==1.12.1
    yapf==0.31.0
    ```
- frontend - React
    ```
    socket.io-client
    @testing-library/react
    eslint
    prettier
    ```
- AWS Cloud9 & Git + Github  

## Warning 
- Made a mistake at the commit part for the unmocked test. You have uncomment line 143, 156, & 171
- For the Javascript test you got make sure that line 143, 156, 171, and 205 are comment out and that line 199-202 are uncomment. Also you might have to change the name test name for the valid
