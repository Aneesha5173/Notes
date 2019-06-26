import React, { useEffect, useState } from "react";
import { Pagination, PaginationItem } from "reactstrap";
import axios from "axios";

const Sample = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [notesPerPage, setPostsPerPage] = useState(10);

  useEffect(() => {
    const intial = window.localStorage.getItem("user");
    // var myStr = localStorage.getItem('myData');
    var myObj = JSON.parse(intial);
    var email = myObj.email;
    console.log(email);
    const fetchNotes = async () => {
      setLoading(true);
      const result = await axios.get(`/getnote/${email}`);
      setNotes(result.data);
      setLoading(false);
    };
    fetchNotes();
  }, []); //empty braces the stop just like componentwillMount
  console.log(notes);
  const indexOfLastNote = currentPage * notesPerPage;
  const indexofFirstNote = indexOfLastNote - notesPerPage;
  const currentNotes = notes.slice(indexofFirstNote, indexOfLastNote);

  for (let i = 1; i <= Math.ceil; i++) {}

  return (
    <div>
      <Pagination />
    </div>
  );
};
export default Sample;
