const aws = require("aws-sdk");

let secrets;
if (process.env.NODE_ENV == "production") {
    secrets = process.env;
} else {
    secrets = require("./secrets");
}

const ses = new aws.SES({
    accessKeyId: secrets.AWS_KEY,
    secretAccessKey: secrets.AWS_SECRET,
    region: "eu-west-1",
});

exports.sendEmail = function (recipient, name, code) {
    return ses
        .sendEmail({
            Source:
                "Translucent Chickadee <translucent.chickadee@spicedling.email>",
            Destination: {
                ToAddresses: [recipient],
            },
            Message: {
                Body: {
                    Text: {
                        Data: `Hi, ${name}! You requested password reset. Your secret code is ${code}. Your code is valid for 10 minutes.`,
                    },
                },
                Subject: {
                    Data: "Password reset",
                },
            },
        })
        .promise()
        .then(() => console.log("it worked!"))
        .catch((err) => console.log("err in sendEmail:", err));
};
