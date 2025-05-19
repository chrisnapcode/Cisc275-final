import React, { useState, useEffect } from "react";
import { auth, db } from "../firebase";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { ref, get, set } from "firebase/database";

interface UserProfile {
  age: string;
  hasCollegeDegree: boolean;
  collegeDegree: string;
  softSkills: string;
  experience: string;
  interests: string;
}

const UserProfileForm: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<UserProfile>({ //questions user will answer
    age: "",
    hasCollegeDegree: false,
    collegeDegree: "",
    softSkills: "",
    experience: "",
    interests: "",
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        alert("You must be signed in to access this page.");
        navigate("/");
        return;
      }

      const userId = user.uid;
      const snapshot = await get(ref(db, `moreUserInfo/${userId}`)); // Fetch user data from the database

      if (snapshot.exists()) {
        const data = snapshot.val() as UserProfile; // If user has a form, get the data and fill out the form with it
        setFormData({
          age: data.age || "",
          hasCollegeDegree: data.hasCollegeDegree || false,
          collegeDegree: data.collegeDegree || "",
          softSkills: data.softSkills || "",
          experience: data.experience || "",
          interests: data.interests || "",
        });
      }
    });

    return () => {
      unsubscribe();
    };
  }, [navigate]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const userId = auth.currentUser?.uid;
    if (!formData.hasCollegeDegree){
      formData.collegeDegree = "";
    }
    set(ref(db, `moreUserInfo/${userId}`), formData); // Save the form data to the database
    console.log("User Profile saved:", formData);
    alert("Information saved successfully!");
    navigate("/");
  };

  return (
    <form className="user-profile-form" onSubmit={handleSubmit}>
      <h2>User Profile</h2>
      <label>
        Age:
        <input
          type="number"
          name="age"
          value={formData.age}
          onChange={handleChange}
          required
        />
      </label>

      <div className="checkbox-container">
        <input
          type="checkbox"
          name="hasCollegeDegree"
          id="college-degree-checkbox"
          checked={formData.hasCollegeDegree}
          onChange={handleChange}
        />
        <label htmlFor="college-degree-checkbox">I have a college degree</label>
      </div>

      {formData.hasCollegeDegree && (
        <label>
          College Degree:
          <input
            type="text"
            name="collegeDegree"
            value={formData.collegeDegree}
            onChange={handleChange}
            placeholder="e.g. B.S. in Biology"
            required
          />
        </label>
      )}

      <label>
        Soft Skills:
        <textarea
          name="softSkills"
          value={formData.softSkills}
          onChange={handleChange}
          placeholder="e.g. Communication, Teamwork, Critical Thinking"
          required
        />
      </label>

      <label>
        Work Experience:
        <textarea
          name="experience"
          value={formData.experience}
          onChange={handleChange}
          placeholder="e.g. Retail Associate at Target (2022–2023), Freelance Graphic Designer"
        />
      </label>

      <label>
        Interests:
        <textarea
          name="interests"
          value={formData.interests}
          onChange={handleChange}
          placeholder="e.g. Cars, Math, Design, Physics, Music, Sports"
        />
      </label>

      <button type="submit">Submit</button>
    </form>
  );
};

export default UserProfileForm;
