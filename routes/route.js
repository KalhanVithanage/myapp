// const { Router } = require("express");

(express = require("express")), (router = express.Router());
const axios = require("axios");
const { json } = require("body-parser");
const fs = require("fs");
const path = require("path");
const config = require("../config/config");
const { dbConnection } = require("../db/db");

router.route("/").get((req, res, next) => {
  console.log("hello  bor ");
  res.send("user hello");
});

router.route("/login").post((req, res, next) => {
  const { pname, password } = req.body;

  const _query = `SELECT * FROM  parent where pname = "${pname}" AND password = "${password}" ; `;

  dbConnection.db.query(_query, (err, data) => {
    if (err) console.log(err);
    else {
      console.log(data);
      res.status(200).json(data);
    }
  });
});

router.route("/register").post((req, res, next) => {
  const { pname, cname, password, comfirmPassword } = req.body;
  const pId = Math.floor(Math.random() * 100);
  const cId = Math.floor(Math.random() * 50);

  const _query = `INSERT INTO parent (pname,cname,password,comfirmPassword,pId,cId) values ("${pname}","${cname}","${password}","${comfirmPassword}","${pId}","${cId}") ; `;

  dbConnection.db.query(_query, (err, data) => {
    if (err) console.log(err);
    else {
      console.log("sucsss");
      res.status(200).json("success");
    }
  });
});

router.route("/upload").post(async (req, res, next) => {
  const { pId, cId } = req.body;
  let _fileName = `${Date.now()}.jpg`;
  console.log(_fileName);
  const filePath = `../public/images/${_fileName}`;
  console.log(filePath);
  var today = new Date();
  let imgToStrng = req.body.base64.split(",")[1];
  let buffer = Buffer.from(imgToStrng, "base64");
  const str = config.baseUrl + "/user/static/images/" + `${_fileName}`;
  var date =
    today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();

  const _query = `INSERT INTO user (userImg,uploadedTime,pId,cId) values ("${str}","${date}","${pId}","${cId}") ; `;

  dbConnection.db.query(_query, (err, data) => {
    if (err) console.log(err);
    else {
      console.log("sucsss");
    }
  });
  res.status(200).json("image uploaded");

  console.log(str);
  fs.writeFileSync(path.join(__dirname, filePath), buffer);

  //   res.send(filePath)
});

router.route("/words").post(async (req, res, next) => {
  const { text, pId, cId } = req.body;
  const words = text.split(" ");

  for (const i of words) {
    const config = {
      headers: {
        Authorization: `Bearer iDkLygrb37LaxyS2KoNXWtxs3bvf2ipDQ0h0VvdWCb6kutpKbXczUM8q/Aw789y9BiAK7/dKTc60acvr487V8g==`,
      },
    };

    const bodyParameters = {
      key: {
        Inputs: {
          input1: {
            ColumnNames: [
              "No",
              "Preprocessed Violent toxic words",
              "Sentiment Value",
            ],
            Values: [["0", i, "value"]],
          },
        },
        GlobalParameters: {},
      },
    };

    await axios
      .post(
        "https://ussouthcentral.services.azureml.net/workspaces/418633b40be445628e1d0bfd574e1bcb/services/ff806f42a52443269ef481162c09186a/execute?api-version=2.0&details=true&Authorization=Bearer iDkLygrb37LaxyS2KoNXWtxs3bvf2ipDQ0h0VvdWCb6kutpKbXczUM8q/Aw789y9BiAK7/dKTc60acvr487V8g==",
        bodyParameters.key,
        config
      )
      .then((data) => {
        const arr = [];
        for (const value in data.data.Results.output1) {
          arr.push(data.data.Results.output1[value].Values);
        }
        let _data = arr.filter(function (element) {
          return element !== undefined;
        });
        let item = _data.flat(2).splice(2, 4).join(",");
        let _item = _data.flat(2);
        var today = new Date();
        var date =
          today.getFullYear() +
          "-" +
          (today.getMonth() + 1) +
          "-" +
          today.getDate();

        const _query = `INSERT INTO textInput (result,pId,cId,type,date) values ("${item}","${pId}","${cId}","${_item[3]}","${date}") ; `;

        dbConnection.db.query(_query, (err, data) => {
          if (err) console.log(err);
          else {
            console.log("sucsss");
          }
        });
      })
      .catch(console.log);
  }
  res.status(200).json("added");
  //   res.send(filePath)
});

router.route("/posts").post(async (req, _res, next) => {
  // let acess_token = "EAAYZB4UMZACkoBAFtZCwnZBbd2uCmT9dCOX2BolEcWZCFUNa0Tsfq9ZCgKvmaF2ayzZCt9keVnmNllLcZCXskvMHcNECC7tE4LKc1qmv5Bn30O4g6UmJ0IYLCi5a1PqZAZBzRAZAb58qvZBczPyWWySrVzMb2eCEuqbKZCuOOVdvZBIepZArEggXGOyr8OWlbwEQHzipFvRg6iUYzRDby4fsIZBZBwZCWVmp5kuExMF7YZD";
  const token = req.query;
  const { pId, cId } = req.body;
  console.log(token.id);
  await axios
    .get(
      `https://graph.facebook.com/v14.0/me?fields=posts%7Bcomments%7D&access_token=${token.id}`
    )
    .then((_data) => {
      for (const value in _data.data.posts.data) {
        let _obj = _data.data.posts.data[value].comments;
        _obj?.data.map((res) => {
          const config = {
            headers: {
              Authorization: `Bearer /5Hgv9rTWlEqxq2+alLk1f/nYm6Nih8rY/KC2VxfV9KAWDhvlcEF0pYZjCIx5cW5voK7BGPS3xWivQaILPBNXQ==`,
            },
          };

          let data = {
            Inputs: {
              input1: {
                ColumnNames: [
                  "PhraseNo",
                  "Phrase",
                  "IsHateSpeech",
                  "Column 3",
                  "Column 4",
                ],
                Values: [["value", res.message, "value", "value", "value"]],
              },
            },
            GlobalParameters: {},
          };

          axios
            .post(
              "https://ussouthcentral.services.azureml.net/workspaces/2dc02343464b4bfea980c8d46d495d8b/services/24fd94a389554c329ee560a0c3f5ab37/execute?api-version=2.0&details=true",
              data,
              config
            )
            .then((data) => {
              const arr = [];
              for (const value in data.data.Results.output1) {
                arr.push(data.data.Results.output1[value].Values);
              }
              let _data = arr.filter(function (element) {
                return element !== undefined;
              });
              let item = _data.flat(2).splice(2, 4).join(",");

              let _item = _data.flat(2).splice(1, 4);
              console.log(_item[0]);
              var today = new Date();
              var date =
                today.getFullYear() +
                "-" +
                (today.getMonth() + 1) +
                "-" +
                today.getDate();

              const _query = `INSERT INTO posts (result,pId,cId,type,date) values ("${_item[0]}","${pId}","${cId}","${_item[1]}","${date}") ; `;

              dbConnection.db.query(_query, (err, data) => {
                if (err) console.log(err);
                else {
                  console.log("sucsss", data);
                }
              });
            })
            .catch(console.log);
        });
        _res.status(200).json("added");
      }
    })
    .catch((e) => console.log(e));
});

router.route("/words").get((req, res, next) => {
  let type = req.query.type;
  let _query;
  if (type == "positive") {
    _query = `SELECT * FROM textInput where type = 'Positive' ; `;
  } else {
    _query = `SELECT * FROM textInput where type = 'Negative' ; `;
  }
  dbConnection.db.query(_query, (err, data) => {
    if (err) console.log(err);
    else {
      res.status(200).json(data);
    }
  });
});

router.route("/images").get((req, res, next) => {
  const _query = `SELECT * FROM user ; `;

  dbConnection.db.query(_query, (err, data) => {
    if (err) console.log(err);
    else {
      res.status(200).json(data);
      console.log("sucsss");
    }
  });
});

router.route("/posts").get((req, res, next) => {
  let type = req.query.type;
  let _query;
  if (type == "no") {
    _query = `SELECT * FROM posts where type = 'NO' ; `;
  } else {
    _query = `SELECT * FROM posts where type ='YES'; `;
  }
  dbConnection.db.query(_query, (err, data) => {
    if (err) console.log(err);
    else {
      res.status(200).json(data);
    }
  });
});

router.route("/games").post(async (req, res, next) => {
  let imgToStrng = req.body.img.split(",")[1];
  let buffer = Buffer.from(imgToStrng, "base64");

  const data = await axios.post("52.201.236.100/upload", buffer);
  console.log(data);
});

router.route("/insert").post(async (req, res, next) => {
  const { obj, pId, cId } = req.body;
  var today = new Date();
  console.log(obj);
  let date =
    today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();
  if (obj.game === "pubg mobile") {
    const game = obj.game;
    const type = obj.type;
    const details = obj.details;
    const about = obj.about;

    const _query = `INSERT INTO pubg (game,type,details,about,date,pId,cId) values ("${game}","${type}","${details}","${about}","${date}","${pId}","${cId}") ; `;

    dbConnection.db.query(_query, (err, data) => {
      if (err) console.log(err);
      else {
        console.log("sucsss");
        res.status(200).json("success");
      }
    });
  } else {
    const game = obj.game;
    const type = obj.type;
    const details = obj.details;
    const about = obj.about;
    const _query = `INSERT INTO callofduty (game,type,details,about,date,pId,cId) values ("${game}","${type}","${details}","${about}","${date}","${pId}","${cId}") ; `;

    dbConnection.db.query(_query, (err, data) => {
      if (err) console.log(err);
      else {
        console.log("sucsss");
        res.status(200).json("success");
      }
    });
  }
});

router.route("/list").get((req, res, next) => {
  const type = req.query.type;

  if (type == "pubg") {
    const _query = `SELECT * FROM pubg   ; `;

    dbConnection.db.query(_query, (err, data) => {
      if (err) console.log(err);
      else {
        res.status(200).json(data);
        console.log("sucsss");
      }
    });
  } else {
    const _query = `SELECT * FROM callofduty   ; `;

    dbConnection.db.query(_query, (err, data) => {
      if (err) console.log(err);
      else {
        res.status(200).json(data);
        console.log("sucsss");
      }
    });
  }
});

module.exports = router;
