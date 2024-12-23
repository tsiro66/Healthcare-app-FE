import { Link } from "react-router-dom";

const NotFoundPage = () => {
  return (
    <div>
      404 Page Not Found
      <Link to="/patients">Go Back</Link>
      {/* Use Link instead of <a> for client-side routing (Link does not refresh the page) */}
    </div>
  );
};

export default NotFoundPage;
