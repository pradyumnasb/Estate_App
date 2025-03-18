import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../Context/AuthContext";
import Card from "../ProjectPage/Card";
import PropTypes from "prop-types";

function List({ fetchType = "user", posts: propPosts = [] }) {
  const { currentUser } = useContext(AuthContext);
  const [posts, setPosts] = useState(propPosts);
  const [loading, setLoading] = useState(fetchType && propPosts.length === 0);

  useEffect(() => {
    if (!fetchType || !currentUser || !currentUser._id || propPosts.length > 0) {
      setLoading(false);
      return;
    }

    const fetchPosts = async () => {
      try {
        let url =
          fetchType === "saved"
            ? `http://localhost:4000/api/posts/saved`
            : `http://localhost:4000/api/posts/user/${currentUser._id}`;

        const res = await fetch(url, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (!res.ok) throw new Error(`Failed to fetch ${fetchType} posts`);

        const data = await res.json();
        setPosts(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error(`Error fetching ${fetchType} posts:`, error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [currentUser, fetchType]);

  // ✅ Handle post deletion
  const handleDeletePost = async (postId) => {
    try {
      const res = await fetch(`http://localhost:4000/api/posts/${postId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!res.ok) throw new Error("Failed to delete post");

      // ✅ Remove the deleted post from the list
      setPosts((prevPosts) => prevPosts.filter((post) => (post.post ? post.post._id !== postId : post._id !== postId)));
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  if (loading) return <p>Loading {fetchType} posts...</p>;
  if (posts.length === 0) return <p>No {fetchType} posts found.</p>;

  return (
    <div className="flex flex-col gap-6">
      {posts.map((savedPost, index) => {
        const postData = savedPost.post || savedPost;

        if (!postData || !postData._id) {
          console.error(`Skipping invalid post at index ${index}`, savedPost);
          return null;
        }

        return <Card key={postData._id} item={postData} onDelete={handleDeletePost} />;
      })}
    </div>
  );
}

List.propTypes = {
  fetchType: PropTypes.oneOf(["user", "saved"]),
  posts: PropTypes.array,
};

export default List;
