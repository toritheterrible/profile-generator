
const axios = require("axios");
const inquirer = require("inquirer");
const fs = require("fs");
const util = require("util");
var generateHTML = require("./generateHTML");
var pdf = require('html-pdf');
var config = {format: 'A4'};

const writeFileAsync = util.promisify(fs.writeFile);

let questions = [
    {
        type:'input',
        name: "username",
        message: "Type in your github username"
    
    },
    {
        message: 'What is your favorite color?',
        name: 'color',
        type: 'list',
        choices: ['green', 'blue', 'pink', 'red'],
    }


];

inquirer
.prompt(questions)
.then(function ({ username, color}) {
    console.log(username, color);
    const queryUrl = `https://api.github.com/users/${username}`;

        axios.get(queryUrl).then(function(res) {
                // console.log(res.data)
            
            data = {
                color: color,
                profilePic: res.data.avatar_url,
                name: res.data.login,
                location: res.data.location,
                profileUrl: res.data.html_url,
                blog: res.data.blog,
                bio: res.data.bio,
                company: res.data.company,
                repos: res.data.public_repos,
                followers: res.data.followers,
                following: res.data.following,
            
            }


                axios.get(`https://api.github.com/users/${username}/repos`).then(function (res) {
                    let starCount = 0;
                    for (let index = 0; index < res.data.length; index++) {
                      let count = res.data[index].stargazers_count;
                      starCount = starCount + count;
                    }
                data.starCount = starCount;
             
        pdf.create(generateHTML(data, config)).toFile('./profile.pdf', function(err, res) {

            if (err) {
                throw err;
            }
                
                    html = generateHTML(data);
        
         writeFileAsync("index.html", html);
        });
    });
    });

});
