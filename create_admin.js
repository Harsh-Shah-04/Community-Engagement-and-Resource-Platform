db.users.updateOne(
  {email: "harsh@example.com"}, 
  {$set: {role: "admin"}}
)