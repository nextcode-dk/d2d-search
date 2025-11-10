import React, { useState, useEffect } from "react";
import algoliasearch from "algoliasearch/lite";

const searchClient = algoliasearch(
  import.meta.env.VITE_ALGOLIA_APP_ID,
  import.meta.env.VITE_ALGOLIA_SEARCH_KEY
);
const index = searchClient.initIndex(import.meta.env.VITE_ALGOLIA_INDEX || "carriers_trips");

function weekdayFromDate(dateStr) {
  const d = new Date(dateStr + "T00:00:00");
  const names = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
  return names[d.getDay()];
}

export default function App() {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [date, setDate] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [startCountries, setStartCountries] = useState([]);
  const [endCountries, setEndCountries] = useState([]);
  const [fromInput, setFromInput] = useState("");
  const [toInput, setToInput] = useState("");
  const [showFromDropdown, setShowFromDropdown] = useState(false);
  const [showToDropdown, setShowToDropdown] = useState(false);

  // Fetch facet values on mount
  useEffect(() => {
    async function fetchFacets() {
      const startFacet = await index.searchForFacetValues("startCountry", "", { maxFacetHits: 100 });
      const endFacet = await index.searchForFacetValues("endCountry", "", { maxFacetHits: 100 });
      setStartCountries(startFacet.facetHits.map(f => f.value));
      setEndCountries(endFacet.facetHits.map(f => f.value));
    }
    fetchFacets();
  }, []);

  // Filtered suggestions for typeahead
  const filteredFromCountries = startCountries.filter(c =>
    c.toLowerCase().includes(fromInput.toLowerCase())
  );
  const filteredToCountries = endCountries.filter(c =>
    c.toLowerCase().includes(toInput.toLowerCase())
  );

  // Swap handler
  const handleSwap = () => {
    setFrom(to);
    setFromInput(to);
    setTo(from);
    setToInput(from);
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);

    const filters = [];
    if (from) filters.push(`startCountry:"${from}"`);
    if (to) filters.push(`endCountry:"${to}"`);
    if (date) {
      const day = weekdayFromDate(date);
      filters.push(`dayOfWeek:"${day}"`);
      console.log("Searching for day:", day);
    }

    const { hits } = await index.search("", {
      filters: filters.join(" AND "),
      hitsPerPage: 50
    });

    setResults(hits);
    setLoading(false);
  };

  return (
    <div className="container">
      <section
        className="hero-banner"
        style={{
          width: "100%",
          height: 400,
          background: `linear-gradient(90deg, rgba(79,140,255,0.15) 0%, rgba(110,214,255,0.1) 100%), url('/hero.jpeg') center/cover no-repeat`,
          color: "#fff",
          padding: "40px 0 30px 0",
          marginBottom: 24,
          borderRadius: 8,
          textAlign: "center",
          boxShadow: "0 4px 24px rgba(0,0,0,0.08)"
        }}
      > 
      </section>
      <div className="card">
        <h1 style={{fontSize: "2.5rem", margin: 0, fontWeight: 700}}>Find Carriers</h1>
        <form onSubmit={handleSearch} style={{marginTop:12}}>
          <div className="row" style={{marginBottom:12, alignItems: "center"}}>
            <div style={{position: "relative"}}>
              <input
                className="input"
                placeholder="From country (any)"
                value={fromInput}
                onChange={e => {
                  setFromInput(e.target.value);
                  setShowFromDropdown(true);
                  setFrom(""); // Clear selection until picked
                }}
                onFocus={() => setShowFromDropdown(true)}
                onBlur={() => setTimeout(() => setShowFromDropdown(false), 100)}
                autoComplete="off"
              />
              {showFromDropdown && filteredFromCountries.length > 0 && (
                <div className="dropdown">
                  {filteredFromCountries.map(c => (
                    <div
                      key={c}
                      className="dropdown-item"
                      onMouseDown={() => {
                        setFrom(c);
                        setFromInput(c);
                        setShowFromDropdown(false);
                      }}
                    >
                      {c}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <button
              type="button"
              className="button"
              style={{margin: "0 8px", padding: "0 8px", height: 36}}
              onClick={handleSwap}
              title="Swap"
            >⇄</button>
            <div style={{position: "relative"}}>
              <input
                className="input"
                placeholder="To country (any)"
                value={toInput}
                onChange={e => {
                  setToInput(e.target.value);
                  setShowToDropdown(true);
                  setTo(""); // Clear selection until picked
                }}
                onFocus={() => setShowToDropdown(true)}
                onBlur={() => setTimeout(() => setShowToDropdown(false), 100)}
                autoComplete="off"
              />
              {showToDropdown && filteredToCountries.length > 0 && (
                <div className="dropdown">
                  {filteredToCountries.map(c => (
                    <div
                      key={c}
                      className="dropdown-item"
                      onMouseDown={() => {
                        setTo(c);
                        setToInput(c);
                        setShowToDropdown(false);
                      }}
                    >
                      {c}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <input className="input" type="date" value={date} onChange={e => setDate(e.target.value)} />
            <button className="button" type="submit">Search</button>
          </div>
        </form>
        <div>
          {loading && <p className="small">Searching...</p>}
          {!loading && results.length === 0 && <p className="small">No routes found.</p>}
          {results.map(r => (
            <div key={r.objectID} className="result" style={{marginTop:8}}>
              <div style={{display: 'flex', gap: '12px', alignItems: 'center'}}>
                {r.profileImage && (
                  <img 
                    src={r.profileImage} 
                    alt={r.company} 
                    style={{width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px'}}
                  />
                )}
                <div>
                  <strong>{r.company}</strong>
                  <div className="small">{r.startCountry} → {r.endCountry}</div>
                  <div className="small">{r.dayOfWeek}</div>
                </div>
              </div>
              <div style={{textAlign:"right"}}>
                {r.contact?.phones?.map((p,i)=> <div className="small" key={i}>{p}</div>)}
                {r.contact?.email && <div className="small">{r.contact.email}</div>}
                {r.contact?.website && <a className="small" href={r.contact.website} target="_blank" rel="noreferrer">Website</a>}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div style={{marginTop:12}} className="small">
        Tip: pick a specific date — the app will match the weekday (e.g., 2025-10-20 -> Monday).
      </div>
    </div>
  );
}