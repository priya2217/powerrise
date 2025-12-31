import { useEffect, useState } from "react";
import { getWorkoutPlans, createWorkoutPlan, updateWorkoutPlan } from "../api";

export default function WorkoutPlan() {
  const [plans, setPlans] = useState([]);
  const [form, setForm] = useState({
    id: null,
    name: "",
    duration: "",
    exercises: "",
  });
  const [loading, setLoading] = useState(false);

  // Load saved plans from API
  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const data = await getWorkoutPlans(); // Use imported function
      setPlans(data);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch plans");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSave = async () => {
    if (!form.name || !form.duration || !form.exercises) {
      alert("Please fill all fields");
      return;
    }

    try {
      setLoading(true);

      if (form.id) {
        // Update existing plan
        await updateWorkoutPlan(form.id, form);
      } else {
        // Create new plan
        await createWorkoutPlan(form);
      }

      fetchPlans(); // Refresh list
      setForm({ id: null, name: "", duration: "", exercises: "" });
    } catch (err) {
      console.error(err);
      alert(err || "Failed to save plan");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (plan) => setForm(plan);

}// ... rest of component