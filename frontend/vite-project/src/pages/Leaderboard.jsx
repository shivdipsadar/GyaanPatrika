import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"; 
import { useNavigate } from "react-router-dom";
import API from "../utils/api";

function Leaderboard() {
  const { quizId } = useParams();
  const navigate = useNavigate(); // ✅ define navigate here
  const [leaderboard, setLeaderboard] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [currentUserRank, setCurrentUserRank] = useState(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await API.get(`/attempts/${quizId}/leaderboard`);
        setLeaderboard(res.data);

        // Fetch logged-in user ID
        const storedUser = JSON.parse(localStorage.getItem("user"));
        if (storedUser?._id) {
          setCurrentUserId(storedUser._id);

          // find current user rank
          const rankIndex = res.data.findIndex(
            (entry) => entry.user?._id?.toString() === storedUser._id.toString()
          );
          if (rankIndex !== -1) {
            setCurrentUserRank({
              rank: rankIndex + 1,
              username: res.data[rankIndex].user?.username || "Anonymous",
              score: res.data[rankIndex].score,
            });
          }
        }
      } catch (err) {
        console.error("Error fetching leaderboard:", err);
      }
    };
    fetchLeaderboard();
  }, [quizId]);

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100 p-6">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-3xl flex flex-col flex-1">
        
        {/* Header with back button */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">🏆 Leaderboard</h1>
          <button
            onClick={() => navigate(-1)} // ✅ go back two steps
            className="px-5 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
          >
            ⬅ Back
          </button>
        </div>

        {/* Scrollable table */}
        <div className="flex-1 overflow-y-auto border rounded-lg">
          <table className="w-full border-collapse">
            <thead className="sticky top-0 bg-gray-200 z-10">
              <tr className="text-left">
                <th className="p-3">Rank</th>
                <th className="p-3">Username</th>
                <th className="p-3">Score</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((entry, idx) => {
                const isCurrentUser = entry.user?._id?.toString() === currentUserId?.toString();
                return (
                  <tr
                    key={entry._id}
                    className={`${
                      isCurrentUser
                        ? "bg-yellow-100 font-bold"
                        : idx % 2 === 0
                        ? "bg-gray-50"
                        : "bg-white"
                    } hover:bg-gray-100`}
                  >
                    <td className="p-3">{idx + 1}</td>
                    <td className="p-3">{entry.user?.username || "Anonymous"}</td>
                    <td className="p-3">{entry.score}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Current user rank */}
        {currentUserRank && (
          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-300 rounded-lg shadow text-center">
            <p className="font-bold text-lg">🎯 Your Rank</p>
            <p>
              Rank: <span className="font-bold">{currentUserRank.rank}</span> | 
              Username: <span className="font-bold">{currentUserRank.username}</span> | 
              Score: <span className="font-bold">{currentUserRank.score}</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Leaderboard;
