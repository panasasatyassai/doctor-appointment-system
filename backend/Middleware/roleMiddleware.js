// const roleMiddleware = (...allowedRoles) => {
//   return (req, res, next) => {
//     try {
//       // authMiddleware already attached user
//       const user = req.user;

//       if (!user) {
//         return res.status(401).send({
//           success: false,
//           message: "Unauthorized",
//         });
//       }

//       if (!allowedRoles.includes(user.role)) {
//         return res.status(403).send({
//           success: false,
//           message: "Access denied",
//         });
//       }

//       next();
//     } catch (error) {
//       console.log(error);
//       res.status(500).send({
//         success: false,
//         message: "Role authorization failed",
//       });
//     }
//   };
// };

// module.exports = roleMiddleware;
