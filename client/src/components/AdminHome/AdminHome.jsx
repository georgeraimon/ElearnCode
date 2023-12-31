import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Table, Button } from "react-bootstrap";
import { FiPlusSquare, FiEdit3 } from "react-icons/fi";
import { CiLogout } from "react-icons/ci";
import { MdDeleteOutline, MdOutlineOpenInBrowser } from "react-icons/md";
import PreLoader from "../PreLoader/PreLoader";
import "./AdminHome.css";



export default function AdminHome() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [tracks, setTracks] = useState([]);

  useEffect(() => {
    if (!localStorage.getItem("adminToken")) {
      navigate("/admin_login");
    } else {
      fetch(`${import.meta.env.VITE_APP_BASE_URL}/api/admin/verifyToken`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          adminToken: localStorage.getItem("adminToken"),
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (!data.admin) {
            localStorage.removeItem("adminToken");
            navigate("/admin_login");
          } else {
            fetch(`${import.meta.env.VITE_APP_BASE_URL}/api/admin/tracks`, {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
            })
              .then((response) => response.json())
              .then((tdata) => {
                setTracks(tdata.tracks);
              });
            setName(data.admin.name);
          }
        });
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 2500);
  }, [navigate]);

  const trackDelete = (id) => {
    fetch(`${import.meta.env.VITE_APP_BASE_URL}/api/admin/trackDelete`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: id,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        setTracks(data.tracks);
      });
  };

  return (
    <div>
       {loading ? (
        <PreLoader />
      ) : (
      <div className="container admin-home">
        {/*Main Heading */}
        <div className="admin-home-heading">
          <h1>Welcome {name}</h1>
        </div>

        {/* Main Div */}
        <div className="container admin-track">
          {/* Tacks Heading */}
          <div className="admin-track-heading">
            <h2>Avaliable Subjects</h2>
          </div>

          {/* Logut Admin */}
          <div className="admin-logout">
            <Button
              variant="primary"
              onClick={() => {
                localStorage.removeItem("adminToken");
                navigate("/admin_login");
              }}
            >
              <CiLogout /> Logout
            </Button>
          </div>

          {/* Add Track */}
          <div className="add-track">
            <Button
              variant="primary"
              onClick={() => navigate("/admin_add_track")}
            >
              <FiPlusSquare /> Add Subject
            </Button>
          </div>

          {/* Tracks Table */}
          {tracks.length > 0 ? (
            <div className="tracks">
              <Table>
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Title</th>
                    <th>Description</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                {tracks.map((track) => (
                <tr key={track._id}>
                      <td>
                        <img src={track.image} alt={track.name} />
                      </td>
                      <td className="title">{track.name}</td>
                      <td className="desc">{track.description}</td>
                      <td className="act">
                         <Button
                          variant="success"
                          onClick={() =>
                            navigate(`/admin_home/view/${track._id}`)
                          }
                        >
                          <MdOutlineOpenInBrowser /> View
                        </Button>
                        <Button
                          variant="primary"
                          onClick={() =>
                            navigate(`/admin_home/edit/${track._id}`)
                          }
                        >
                          <FiEdit3 /> Edit
                        </Button>
                        <Button
                          variant="danger"
                          onClick={() => trackDelete(track._id)}
                        >
                          <MdDeleteOutline /> Delete
                        </Button>
                       
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          ) : (
            <div className="no-tracks">
              <h3>No Subject Available</h3>
            </div>
          )}
        </div>
      </div>
      )}
    </div>
  );
}
