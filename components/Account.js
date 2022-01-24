import { useState, useEffect } from "react";
import { supabase } from "../utils/supabaseClient";
import Avatar from "./Avatar";

export default function Account({ session }) {
  const [loading, setLoading] = useState(true);
  const [firstname, setFirstname] = useState(null);
  const [lastname, setLastname] = useState(null);
  const [phone, setPhone] = useState(null);
  const [pic, setPic] = useState(null);
  const [country, setCountry] = useState(null);
  const [city, setCity] = useState(null);

  useEffect(() => {
    getProfile();
  }, [session]);

  async function getProfile() {
    try {
      setLoading(true);
      const user = supabase.auth.user();

      let { data, error, status } = await supabase
        .from("profiles")
        .select(`firstname, lastname, phone, city,country,pic `)
        .eq("id", user.id)
        .single();

      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        setFirstname(data.firstname);
        setLastname(data.lastname);
        setPhone(data.phone);
        setCity(data.city);
        setCountry(data.country);
        setPic(data.pic);
      }
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function updateProfile({
    firstname,
    lastname,
    phone,
    city,
    country,
    pic,
  }) {
    try {
      setLoading(true);
      const user = supabase.auth.user();
      const updates = {
        id: user.id,
        firstname,
        lastname,
        phone,
        city,
        country,
        pic,
        updated_at: new Date(),
        created_at: new Date(),
      };

      let { error } = await supabase.from("profiles").upsert(updates, {
        returning: "minimal", // Don't return the value after inserting
      });

      if (error) {
        throw error;
      }
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="form-widget">
      <Avatar
        url={pic}
        size={120}
        onUpload={(url) => {
          setPic(url);
          updateProfile({
            firstname,
            lastname,
            pic,
            country,
            city,
            phone: url,
          });
        }}
      />
      <div>
        <label htmlFor="email">Email</label>
        <input id="email" type="text" value={session.user.email} disabled />
      </div>
      <div>
        <label htmlFor="firstname">Name</label>
        <input
          id="firstname"
          type="text"
          value={firstname || ""}
          onChange={(e) => setFirstname(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="lastname">Syrname</label>
        <input
          id="lastname"
          type="text"
          value={lastname || ""}
          onChange={(e) => setLastname(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="phone">Phone</label>
        <input
          id="phone"
          type="text"
          value={phone || ""}
          onChange={(e) => setPhone(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="city">City</label>
        <input
          id="city"
          type="text"
          value={city || ""}
          onChange={(e) => setCity(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="country">Country</label>
        <input
          id="country"
          type="text"
          value={country || ""}
          onChange={(e) => setCountry(e.target.value)}
        />
      </div>

      <div>
        <button
          className="button block primary"
          onClick={() =>
            updateProfile({
              firstname,
              phone,
              city,
              country,
              lastname,
              pic,
            })
          }
          disabled={loading}
        >
          {loading ? "Loading ..." : "Update"}
        </button>
      </div>

      <div>
        <button
          className="button block"
          onClick={() => supabase.auth.signOut()}
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}
