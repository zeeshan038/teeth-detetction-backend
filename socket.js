// NPM Packages
const socketIO = require("socket.io");

// Models
const UserLogs = require("./models/UserLogs");
const StoryModel = require("./models/Story");
const Favorite = require("./models/Favorite");
const User = require("./models/User");

// Scores
const scores = {
  impression: 1,
  click: 3,
  favorite: 10,
};

// Users
const users = {};

module.exports = (server) => {
  const io = socketIO(server);

  io.on("connection", (socket) => {
    console.log("User connected with userId:", socket.handshake.query.userId);

    const userId = socket.handshake.query.userId;
    users[userId] = socket;

    // Function to update user logs and scores
    const updateUserLogsAndScores = async (data, updateFields) => {
      const userData = { user: data.user, storyId: data.storyId };
      try {
        const story = await StoryModel.findById(data.storyId);
        if (!story) {
          console.error("Story not found");
          return;
        }

        const updatePayload = {
          ...updateFields,
          $set: {
            storyId: data.storyId,
          },
          $push: { genres: story.genres },
        };

        // Update or create user log
        const userLog = await UserLogs.findOneAndUpdate(
          userData,
          updatePayload,
          {
            upsert: true,
            new: true,
          }
        );

        // Update score
        const score =
          (userLog.impression || 0) +
          (userLog.click || 0) +
          (userLog.favorite || 0);
        userLog.score = score;
        await userLog.save();
      } catch (error) {
        console.log("Error", error);
        socket.emit("error", error.message);
      }
    };

    // Handle impression event
    socket.on("impression", async (data) => {
      if (!data) {
        console.error("Invalid data format received", data);
        return;
      }

      const { user, storyId } = data;
      console.log("Received data for impression event:", data);

      if (!user || !storyId) {
        console.error(" Missing user or storyId");
        return;
      }

      const updateFields = { $inc: { impression: scores.impression } };
      await updateUserLogsAndScores({ user, storyId }, updateFields);

      try {
        const story = await StoryModel.findById(storyId);
        if (!story) {
          console.error("Story not found");
          socket.emit("Story not found");
          return;
        }

        socket.emit("response", {
          message: "Impression counted successfully",
        });
      } catch (error) {
        console.log("Error handling impression:", error);
        socket.emit("Error handling impression");
      }
    });

    // Handle click event
    socket.on("click", async (data) => {
      if (!data) {
        console.error(" Invalid data format received", data);
        return;
      }

      const { user, storyId } = data;
      console.log("Received data for click event:", data);

      if (!user || !storyId) {
        console.error("Missing user or storyId");
        return;
      }

      const updateFields = { $inc: { click: scores.click } };
      await updateUserLogsAndScores({ user, storyId }, updateFields);

      try {
        const story = await StoryModel.findById(storyId);
        if (!story) {
          console.error("Story not found");
          socket.emit("error", "Story not found");
          return;
        }

        socket.emit("response", {
          message: "Click counted successfully",
        });
      } catch (error) {
        console.log("Error handling click:", error);
        socket.emit("Error handling click");
      }
    });

    // Handle favorite event
    socket.on("favorite", async (data) => {
      if (!data || !data.user || !data.storyId) {
        console.error("Invalid data format received", data);
        return;
      }

      const { user, storyId, genres } = data;
      console.log("Received data for favorite event:", data);

      // Update user logs and scores
      const updateFields = { $inc: { favorite: scores.favorite } };
      await updateUserLogsAndScores({ user, storyId, genres }, updateFields);

      try {
        const story = await StoryModel.findById(storyId);
        if (!story) {
          console.error("Story not found");
          socket.emit("Story not found");
          return;
        }

        const isAlreadyFavorite = story.isFav.some(
          (favUserId) => favUserId.toString() === user.toString()
        );

        if (isAlreadyFavorite) {
          story.isFav = story.isFav.filter(
            (favUserId) => favUserId.toString() !== user.toString()
          );

          if (story.user) {
            await User.findByIdAndUpdate(story.user, {
              $inc: { favScore: -1 },
            });
          }

          await story.save();
          socket.emit("response", {
            message: "Story removed from favorites",
          });
        } else {
          story.isFav.push(user);

          if (story.user) {
            await User.findByIdAndUpdate(story.user, {
              $inc: { favScore: 1 },
            });
          }

          await story.save();
          socket.emit("response", {
            message: "Story favorited successfully",
            favorite: { user, storyId },
          });
        }
      } catch (error) {
        console.log("Error handling favorite:", error);
        socket.emit("Error handling favorite");
      }
    });

    // Handle disconnect
    socket.on("disconnect", () => {
      console.log("User disconnected");
      delete users[userId];
    });
  });

  return io;
};
