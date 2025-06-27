import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import { Container, Row, Col, Button, Spinner, Modal, Card, Badge, Form } from "react-bootstrap";
import { subMonths, subYears, isAfter, format } from "date-fns";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);
function FundArticles({ fundId }) {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selected, setSelected] = useState(null);

  // Fetch articles for this fund
  useEffect(() => {
    setLoading(true);
    fetch(`http://localhost:8000/api/articles/?fund_id=${fundId}&limit=${showAll ? 100 : 20}`)
      .then(res => res.json())
      .then(data => {
        setArticles(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching articles:", err);
        setLoading(false);
      });
  }, [fundId, showAll]);

  const handleOpen = (article) => {
    setSelected(article);
    setShowModal(true);
  };

  return (
    <>
      <Card className="shadow-sm mt-4" style={{ borderRadius: 18, border: "none", background: "#fff", width: "100%", maxWidth: "100%", overflow: "hidden",  }}>
        <Card.Body>
          <h6 style={{ fontWeight: 700, color: "#103766", marginBottom: 12 }}>Fund Articles & Updates</h6>
          {loading ? (
            <Spinner animation="border" />
          ) : (
            <>
              <div style={{ maxHeight: 325, overflowY: "auto", marginBottom: 10 }}>
                {articles.length === 0 && <div style={{ color: "#888" }}>No articles yet.</div>}
                {articles.map(article => (
                  <div
                    key={article.id}
                    style={{
                      padding: "10px 0",
                      borderBottom: "1px solid #f3f3f3",
                      cursor: "pointer"
                    }}
                    onClick={() => handleOpen(article)}
                  >
                    <div style={{ fontWeight: 600, color: "#1e293b", fontSize: 15 }}>{article.title}</div>
                    <div style={{ color: "#888", fontSize: 12 }}>{new Date(article.date).toLocaleDateString()}</div>
                    <div style={{ color: "#666", fontSize: 13, marginTop: 2 }}>
                      {article.summary?.slice(0, 80)}{article.summary && article.summary.length > 80 ? "..." : ""}
                    </div>
                  </div>
                ))}
              </div>
              {articles.length >= 20 && !showAll && (
                <Button
                  variant="outline-primary"
                  size="sm"
                  style={{ width: "100%" }}
                  onClick={() => setShowAll(true)}
                >
                  Show last 100 records
                </Button>
              )}
            </>
          )}
        </Card.Body>
      </Card>
      {/* Modal for article details */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered dialogClassName="modal-dialog-scrollable">
        <Modal.Header closeButton>
          <Modal.Title>{selected?.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ maxHeight: 500, overflowY: "auto" }}>
          <div style={{ color: "#888", fontSize: 13, marginBottom: 10 }}>{selected?.date && new Date(selected.date).toLocaleDateString()}</div>
          <div style={{ fontSize: 15, color: "#222", whiteSpace: "pre-line" }}>
            {selected?.content || selected?.summary}
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}

function Riskometer({ score, riskData, setShowRiskInfo }) {
  const radius = 80;
  const strokeWidth = 14;
  const circumference = Math.PI * radius;
  const angle = (score / 100) * 180 - 180;
  const needleLength = 70;
  const rad = (angle * Math.PI) / 180;
  const needleX = 100 + needleLength * Math.cos(rad);
  const needleY = 100 + needleLength * Math.sin(rad);
  const arcLength = (score / 100) * circumference;
  const arcOffset = circumference - arcLength;

  return (
    <Card className="shadow-sm mt-4" style={{ borderRadius: 18, border: "none", background: "#fff" }}>
      <Card.Body className="text-center">
        <h6 className="mb-3" style={{ color: "#103766", fontWeight: 600 }}>
          Risk Assessment
          <button
            type="button"
            aria-label="Riskometer Info"
            onClick={() => setShowRiskInfo(true)}
            style={{
              background: "none",
              border: "none",
              outline: "none",
              boxShadow: "none",
              cursor: "pointer",
              padding: 0,
              marginLeft: 8,
              verticalAlign: "middle"
            }}
          >
            <img
              src="https://static.vecteezy.com/system/resources/previews/005/747/960/non_2x/info-icon-template-information-icon-colorful-free-vector.jpg"
              alt="Riskometer Icon"
              style={{ width: 20, height: 20, cursor: "pointer" }}
            />
          </button>
        </h6>
        <svg width="200" height="120" viewBox="0 0 200 120">
          <defs>
            <linearGradient id="riskGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#22c55e" />
              <stop offset="25%" stopColor="#eab308" />
              <stop offset="50%" stopColor="#f97316" />
              <stop offset="75%" stopColor="#ef4444" />
              <stop offset="100%" stopColor="#dc2626" />
            </linearGradient>
          </defs>
          <path
            d="M 20 100 A 80 80 0 0 1 180 100"
            fill="none"
            stroke="#e5e7eb"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />
          <path
            d="M 20 100 A 80 80 0 0 1 180 100"
            fill="none"
            stroke="url(#riskGradient)"
            strokeWidth={strokeWidth - 2}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={arcOffset}
            style={{
              transition: "stroke-dashoffset 0.5s ease-in-out",
              transformOrigin: "100px 100px"
            }}
          />
          <g>
            <line
              x1={100}
              y1={100}
              x2={needleX}
              y2={needleY}
              stroke="#374151"
              strokeWidth="4"
              strokeLinecap="round"
              style={{ transition: "all 0.5s" }}
            />
            <circle cx={100} cy={100} r="6" fill="#374151" />
          </g>
          <text x="20" y="115" fontSize="12" fill="#6b7280" textAnchor="start">0</text>
          <text x="100" y="30" fontSize="12" fill="#6b7280" textAnchor="middle">50</text>
          <text x="180" y="115" fontSize="12" fill="#6b7280" textAnchor="end">100</text>
        </svg>
        <div className="mt-3">
          <div style={{
            fontSize: 16,
            fontWeight: 600,
            color: riskData.color,
            backgroundColor: riskData.bg,
            padding: "7px 18px",
            borderRadius: 20,
            display: "inline-block",
            letterSpacing: 1,
            textTransform: "uppercase"
          }}>
            {riskData.level}
          </div>
          <div className="mt-2" style={{ fontSize: 10, fontWeight: 700, color: "red" }}>
            *Investors should consult their financial distributors if in doubt about whether the product is suitable for them.
          </div>
        </div>
      </Card.Body>
    </Card>
  );
}

function getMonthlyDates(history) {
  const months = [];
  const seen = new Set();
  history.forEach(h => {
    const m = h.history_date.slice(0, 7);
    if (!seen.has(m)) {
      months.push(h);
      seen.add(m);
    }
  });
  return months;
}

function FundSimulator({ history }) {
  const [investmentType, setInvestmentType] = useState("LUMPSUM");
  const [amount, setAmount] = useState(10000);
  const [timeframe, setTimeframe] = useState("1y");
  const [showSimInfo, setShowSimInfo] = useState(false);

  const filtered = useMemo(() => {
    const now = new Date();
    let cutoff;
    switch (timeframe) {
      case "1y": cutoff = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate()); break;
      case "3y": cutoff = new Date(now.getFullYear() - 3, now.getMonth(), now.getDate()); break;
      case "5y": cutoff = new Date(now.getFullYear() - 5, now.getMonth(), now.getDate()); break;
      default: cutoff = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
    }
    return history.filter(h => new Date(h.history_date) >= cutoff).sort((a, b) => new Date(a.history_date) - new Date(b.history_date));
  }, [history, timeframe]);

  const { labels, values, finalValue } = useMemo(() => {
    if (!filtered.length) return { labels: [], values: [], finalValue: 0 };
    if (investmentType === "LUMPSUM") {
      const initialNAV = filtered[0].nav || 1;
      const units = amount / initialNAV;
      const values = filtered.map(h => units * h.nav);
      const labels = filtered.map(h => format(new Date(h.history_date), "dd-MMM-yyyy"));
      return { labels, values, finalValue: values[values.length - 1] };
    } else {
      const monthly = getMonthlyDates(filtered);
      let totalUnits = 0;
      const values = [];
      monthly.forEach(h => {
        const nav = h.nav || 1;
        totalUnits += amount / nav;
        values.push(totalUnits * nav);
      });
      const labels = monthly.map(h => format(new Date(h.history_date), "dd-MMM-yyyy"));
      return { labels, values, finalValue: values[values.length - 1] };
    }
  }, [filtered, investmentType, amount]);

  const infoText = investmentType === "SIP"
    ? (
      <>
        <b>What is SIP?</b><br />
        SIP (Systematic Investment Plan) means investing a fixed amount at regular intervals (usually monthly).<br /><br />
        <b>How is it calculated?</b><br />
        Every month, your amount is used to buy fund units at that month's NAV. Over time, the value is the total units accumulated × latest NAV.<br /><br />
        <i>SIP is suitable for disciplined, long-term investing and can help average out market volatility.</i>
      </>
    )
    : (
      <>
        <b>What is Lumpsum?</b><br />
        Lumpsum means investing the entire amount at once, at the NAV on the start date.<br /><br />
        <b>How is it calculated?</b><br />
        You buy units at the initial NAV, and your investment value is simply units × NAV at each date.<br /><br />
        <i>Lumpsum is suitable if you have a large amount to invest at once and want to stay invested for a period.</i>
      </>
    );

  return (
    <Card className="shadow-sm mt-1" style={{ borderRadius: 18, border: "none", background: "#fff" }}>
      <Card.Body>
        <h4 style={{ fontWeight: 700, color: "#103766" }}>Fund Simulator</h4>
        <div style={{ color: "#888", fontSize: 14, marginBottom: 18 }}>
          Applicable for regular-growth plan only
        </div>
        <Row className="align-items-end mb-3">
          <Col sm={3} xs={12} className="mb-2">
            <Form.Group>
              <Form.Label style={{ fontSize: 14 }}>
                Investment Type
                <button
                  type="button"
                  aria-label="Investment Type Info"
                  onClick={() => setShowSimInfo(true)}
                  style={{
                    background: "none",
                    border: "none",
                    outline: "none",
                    boxShadow: "none",
                    cursor: "pointer",
                    padding: 0,
                    marginLeft: 8,
                    verticalAlign: "middle"
                  }}
                >
                  <img
                    src="https://static.vecteezy.com/system/resources/previews/005/747/960/non_2x/info-icon-template-information-icon-colorful-free-vector.jpg"
                    alt="Info"
                    style={{ width: 18, height: 18 }}
                  />
                </button>
              </Form.Label>
              <Form.Select value={investmentType} onChange={e => setInvestmentType(e.target.value)}>
                <option value="SIP">SIP-Monthly</option>
                <option value="LUMPSUM">LUMPSUM</option>
              </Form.Select>
            </Form.Group>
          </Col>
          <Col sm={3} xs={12} className="mb-2">
            <Form.Group>
              <Form.Label style={{ fontSize: 14 }}>Amount</Form.Label>
              <Form.Control
                type="number"
                value={amount}
                min={100}
                step={100}
                onChange={e => setAmount(Number(e.target.value))}
                placeholder="₹ Amount"
              />
            </Form.Group>
          </Col>
          <Col sm={3} xs={12} className="mb-2">
            <Form.Group>
              <Form.Label style={{ fontSize: 14 }}>Time Frame</Form.Label>
              <Form.Select value={timeframe} onChange={e => setTimeframe(e.target.value)}>
                <option value="1y">1 Year</option>
                <option value="3y">3 Years</option>
                <option value="5y">5 Years</option>
              </Form.Select>
            </Form.Group>
          </Col>
          <Col sm={3} xs={12} className="mb-2 text-end">
            <div style={{ fontWeight: 600, color: "#103766", fontSize: 15 }}>
              Investment could have been<br />
              <span style={{ fontSize: 22, color: "#2563eb" }}>
                ₹ {finalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
          </Col>
        </Row>
        <div style={{ width: "100%", height: 340 }}>
          <Line
            data={{
              labels,
              datasets: [{
                label: investmentType === "LUMPSUM" ? "Lumpsum Value" : "SIP Value",
                data: values,
                borderColor: "#2563eb",
                backgroundColor: "rgba(37,99,235,0.07)",
                tension: 0.2,
                pointRadius: 1.5,
                borderWidth: 2,
                fill: true,
              }]
            }}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: { display: false },
                title: { display: false }
              },
              scales: {
                x: { grid: { display: true }, title: { display: false } },
                y: { grid: { display: true }, title: { display: false } }
              }
            }}
            height={340}
          />
        </div>

        {/* SIP/Lumpsum Info Modal */}
        <Modal show={showSimInfo} onHide={() => setShowSimInfo(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>{investmentType === "SIP" ? "About SIP Calculation" : "About Lumpsum Calculation"}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div style={{ fontSize: 15, color: "#333" }}>
              {investmentType === "SIP" ? (
                <>
                  <b>What is SIP?</b><br />
                  SIP (Systematic Investment Plan) means investing a fixed amount at regular intervals (usually monthly).<br /><br />
                  <b>How is it calculated?</b><br />
                  Every month, your amount is used to buy fund units at that month's NAV. Over time, the value is the total units accumulated × latest NAV.<br /><br />
                  <i>SIP is suitable for disciplined, long-term investing and can help average out market volatility.</i>
                </>
              ) : (
                <>
                  <b>What is Lumpsum?</b><br />
                  Lumpsum means investing the entire amount at once, at the NAV on the start date.<br /><br />
                  <b>How is it calculated?</b><br />
                  You buy units at the initial NAV, and your investment value is simply units × NAV at each date.<br /><br />
                  <i>Lumpsum is suitable if you have a large amount to invest at once and want to stay invested for a period.</i>
                </>
              )}
            </div>
          </Modal.Body>
        </Modal>
      </Card.Body>
    </Card>
  );
}

function FundDetail() {
  const { id } = useParams();
  const [fund, setFund] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeline, setTimeline] = useState("5y");
  const [showModal, setShowModal] = useState(false);
  const [selectedMetric, setSelectedMetric] = useState("nav");
  const [showRiskInfo, setShowRiskInfo] = useState(false);

  useEffect(() => {
    setLoading(true);
    axios.get(`http://127.0.0.1:8000/api/funds/${id}/`)
      .then(response => setFund(response.data));
    axios.get(`http://127.0.0.1:8000/api/funds/${id}/history/`)
      .then(response => setHistory(response.data))
      .finally(() => setLoading(false));
  }, [id]);

  function filterHistory(timeline) {
    const now = new Date();
    let cutoff;
    switch (timeline) {
      case "1m": cutoff = subMonths(now, 1); break;
      case "3m": cutoff = subMonths(now, 3); break;
      case "1y": cutoff = subYears(now, 1); break;
      case "3y": cutoff = subYears(now, 3); break;
      case "5y": cutoff = subYears(now, 5); break;
      default: cutoff = subYears(now, 1);
    }
    return history
      .filter(h => isAfter(new Date(h.history_date), cutoff))
      .sort((a, b) => new Date(a.history_date) - new Date(b.history_date));
  }

  const filtered = filterHistory(timeline);

  // Color helpers
  function getCapLabel(equitySize) {
    if (equitySize >= 10000) return "large-cap";
    if (equitySize >= 1000) return "mid-cap";
    return "small-cap";
  }
  function getStdDevRisk(stdDev) {
    if (stdDev < 5) return { label: "Low Risk", color: "#28a745", badge: "success" };
    if (stdDev < 15) return { label: "Medium Risk", color: "#ffc107", badge: "warning" };
    return { label: "High Risk", color: "#dc3545", badge: "danger" };
  }
  function getSharpeColor(sharpe) {
    if (sharpe > 2) return { color: "#28a745", badge: "success" };
    if (sharpe >= 1) return { color: "#ffc107", badge: "warning" };
    return { color: "#dc3545", badge: "danger" };
  }
  function getSortinoColor(sortino) {
    if (sortino > 2) return { color: "#28a745", badge: "success" };
    if (sortino >= 1) return { color: "#ffc107", badge: "warning" };
    return { color: "#dc3545", badge: "danger" };
  }

  // Risk calculation function (using equity_size, not market_cap)
  function calculateRiskScore(fund) {
    if (!fund) return 0;
    const stdDev = Number(fund.std_deviation) || 0;
    const sharpe = Number(fund.sharpe_ratio) || 0;
    const sortino = Number(fund.sortino_ratio) || 0;
    const equitySize = Number(fund.equity_size) || 0;
    const normStdDev = Math.min(stdDev / 20, 1);
    const normSharpe = Math.max(0, Math.min(1, (3 - sharpe) / 3));
    const normSortino = Math.max(0, Math.min(1, (3 - sortino) / 3));
    let equitySizeRisk = 0;
    if (equitySize < 1000) equitySizeRisk = 0.8;
    else if (equitySize < 10000) equitySizeRisk = 0.4;
    else equitySizeRisk = 0.1;
    const score = (
      0.4 * normStdDev +
      0.25 * normSharpe +
      0.25 * normSortino +
      0.1 * equitySizeRisk
    ) * 100;
    return Math.min(100, Math.max(0, score));
  }

  function getRiskLevel(score) {
    if (score <= 20) return { level: "LOW", color: "#22c55e", bg: "#dcfce7" };
    if (score <= 40) return { level: "MODERATE", color: "#eab308", bg: "#fef3c7" };
    if (score <= 60) return { level: "MODERATELY HIGH", color: "#f97316", bg: "#fed7aa" };
    if (score <= 80) return { level: "HIGH", color: "#ef4444", bg: "#fecaca" };
    return { level: "VERY HIGH", color: "#dc2626", bg: "#fecaca" };
  }

  // Y-axes: y (left) for NAV/AUM, y1 (right) for Std Dev
  const chartData = {
    labels: filtered.map(h => h.history_date.slice(0, 10)),
    datasets: [
      {
        label: "NAV",
        data: filtered.map(h => h.nav),
        borderColor: "#288cfa",
        backgroundColor: "rgba(40,140,250,0.07)",
        tension: 0.2,
        yAxisID: "y",
        pointRadius: 2,
        borderWidth: 2,
      },
      {
        label: "AUM",
        data: filtered.map(h => h.aum),
        borderColor: "#28a745",
        backgroundColor: "rgba(40,167,69,0.07)",
        tension: 0.2,
        yAxisID: "y",
        pointRadius: 2,
        borderWidth: 2,
      },
      {
        label: "Std Deviation",
        data: filtered.map(h => h.std_deviation),
        borderColor: "#f03f34",
        backgroundColor: "rgba(240,63,52,0.07)",
        tension: 0.2,
        yAxisID: "y1",
        pointRadius: 3,
        borderWidth: 3,
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: true, position: "top" },
      title: { display: false }
    },
    scales: {
      x: { grid: { display: false }, title: { display: false } },
      y: {
        grid: { display: false },
        position: "left",
        title: { display: false },
        ticks: { color: "#288cfa" }
      },
      y1: {
        grid: { display: false },
        position: "right",
        title: { display: false },
        ticks: { color: "#f03f34" }
      }
    },
    hover: { mode: 'nearest' }
  };

  // Single-metric graph data
  const metricLabels = {
    nav: "NAV",
    aum: "AUM",
    std_deviation: "Std Deviation"
  };
  const singleMetricData = {
    labels: filtered.map(h => h.history_date.slice(0, 10)),
    datasets: [
      {
        label: metricLabels[selectedMetric],
        data: filtered.map(h => h[selectedMetric]),
        borderColor:
          selectedMetric === "nav"
            ? "#288cfa"
            : selectedMetric === "aum"
              ? "#28a745"
              : "#f03f34",
        backgroundColor: "rgba(40,140,250,0.07)",
        tension: 0.2,
        pointRadius: 2,
        borderWidth: 2,
      }
    ]
  };
  if (loading) return <Spinner animation="border" />;
  if (!fund) return <div>Fund not found.</div>;

  // Now it's safe to use fund.equity_size etc.

  const capLabel = getCapLabel(fund.equity_size);
  const stdRisk = getStdDevRisk(fund.std_deviation);
  const sharpe = getSharpeColor(fund.sharpe_ratio);
  const sortino = getSortinoColor(fund.sortino_ratio);
  const riskScore = calculateRiskScore(fund);
  const riskData = getRiskLevel(riskScore);

  return (
    <div style={{ background: "#fdf6ee", minHeight: "100vh", padding: "32px 0" }}>
      <Container>
        <Button as={Link} to="/" variant="secondary" className="mb-3">← Back to List</Button>
        <h2 style={{ fontWeight: 600, color: "#103766" }}>{fund.name}</h2>
        <Row className="align-items-stretch g-4">
          {/* Metrics Card */}
          <Col md={4} lg={3}>
            <Card
              className="shadow-sm mb-4"
              style={{
                borderRadius: 18,
                border: "none",
                background: "white",
                minHeight: 200,
                padding: 0,
              }}
            >
              <Card.Body>
                {/* Top row: Equity Size and Std Deviation */}
                <div className="d-flex align-items-center mb-2" style={{ gap: 32, justifyContent: "flex-start" }}>
                  <div>
                    <div className="text-muted" style={{ fontSize: 16 }}>Equity Size</div>
                    <div style={{ fontWeight: 600, fontSize: 22 }}>{capLabel}</div>
                  </div>
                  <div>
                    <div className="text-muted" style={{ fontSize: 16 }}>Std Deviation</div>
                    <div style={{ fontWeight: 600, fontSize: 22, color: stdRisk.color }}>
                      {fund.std_deviation}
                      <Badge
                        bg={stdRisk.badge}
                        className="ms-2"
                        style={{ fontSize: 13, verticalAlign: "middle" }}
                      >
                        {stdRisk.label}
                      </Badge>
                    </div>
                  </div>
                </div>
                {/* Second row: NAV, Sharpe Ratio, Sortino Ratio */}
                <div className="d-flex justify-content-between align-items-center mb-2" style={{ gap: 18 }}>
                  <div>
                    <div className="text-muted" style={{ fontSize: 13 }}>NAV</div>
                    <div style={{ fontWeight: 500, fontSize: 16 }}>{fund.nav}</div>
                  </div>
                  <div>
                    <div className="text-muted" style={{ fontSize: 13 }}>Sharpe Ratio</div>
                    <div style={{ fontWeight: 500, fontSize: 16, color: sharpe.color }}>{fund.sharpe_ratio}</div>
                  </div>
                  <div>
                    <div className="text-muted" style={{ fontSize: 13 }}>Sortino Ratio</div>
                    <div style={{ fontWeight: 500, fontSize: 16, color: sortino.color }}>{fund.sortino_ratio}</div>
                  </div>
                </div>
                {/* Centered button */}
                <div className="d-flex justify-content-center mt-3">
                  <Button variant="outline-primary" size="sm" onClick={() => setShowModal(true)}>
                    View All Metrics
                  </Button>
                </div>
              </Card.Body>
            </Card>
            {/* Riskometer */}
            <Riskometer score={riskScore} riskData={riskData} setShowRiskInfo={setShowRiskInfo} />
            <FundArticles fundId={id} />
          </Col>
          {/* Both graphs side by side in cards */}
          <Col md={8} lg={9}>
            <Row>
              <Col md={6}>
                <Card className="shadow-sm mb-4" style={{ borderRadius: 18, border: "none", background: "#fff", minHeight: 360 }}>
                  <Card.Body>
                    <div className="d-flex justify-content-end mb-2">
                      {["5y", "3y", "1y", "3m", "1m"].map(period => (
                        <Button
                          key={period}
                          variant={timeline === period ? "primary" : "outline-primary"}
                          onClick={() => setTimeline(period)}
                          className="me-2"
                          size="sm"
                        >
                          {period.toUpperCase()}
                        </Button>
                      ))}
                    </div>
                    {/* Combined graph */}
                    <div style={{ width: "100%", height: 280 }}>
                      <Line data={chartData} options={chartOptions} height={280} />
                    </div>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={6}>
                <Card className="shadow-sm mb-4" style={{ borderRadius: 18, border: "none", background: "#fff", minHeight: 360 }}>
                  <Card.Body>
                    <div className="d-flex mb-2">
                      {["nav", "aum", "std_deviation"].map(metric => (
                        <Button
                          key={metric}
                          variant={selectedMetric === metric ? "primary" : "outline-primary"}
                          onClick={() => setSelectedMetric(metric)}
                          className="me-2"
                          size="sm"
                        >
                          {metric.replace("_", " ").toUpperCase()}
                        </Button>
                      ))}
                    </div>
                    {/* Single-metric graph */}
                    <div style={{ width: "100%", height: 280 }}>
                      <Line
                        data={singleMetricData}
                        options={{
                          ...chartOptions,
                          plugins: {
                            ...chartOptions.plugins,
                            legend: { display: false }
                          },
                          scales: {
                            x: chartOptions.scales.x,
                            y: {
                              grid: { display: false },
                              position: "left",
                              title: { display: true, text: metricLabels[selectedMetric] }
                            }
                          }
                        }}
                        height={280}
                      />
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>


            {/* Fund Simulator below the graphs */}


            <FundSimulator history={history} />
          </Col>
        </Row>
        {/* Modal for all metrics */}
        <Modal show={showModal} onHide={() => setShowModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>All Fund Metrics</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="d-flex flex-wrap">
              {Object.entries(fund)
                .filter(([key]) => key !== "id")
                .map(([key, value]) => (
                  <div key={key} style={{ minWidth: 160, margin: 8 }}>
                    <div style={{ fontSize: 13, color: "#888" }}>{key.replace(/_/g, " ").toUpperCase()}</div>
                    <div style={{ fontWeight: 600, fontSize: 16 }}>{value}</div>
                  </div>
                ))}
            </div>
          </Modal.Body>
        </Modal>
        {/* Riskometer Info Modal */}
        <Modal show={showRiskInfo} onHide={() => setShowRiskInfo(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>About Risk Assessment</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div style={{ fontSize: 15, color: "#333" }}>
              <p>
                <b>What is Risk Assessment?</b><br />
                The riskometer provides a visual and intuitive indication of the overall investment risk of this fund, based on key quantitative metrics.
              </p>
              <p>
                <b>How is it calculated?</b><br />
                The risk score is a weighted combination of:
                <ul>
                  <li><b>Standard Deviation</b> (40% weight): Higher values mean higher risk.</li>
                  <li><b>Sharpe Ratio</b> (25%): Lower values mean higher risk.</li>
                  <li><b>Sortino Ratio</b> (25%): Lower values mean higher risk.</li>
                  <li><b>Equity Size</b> (10%): Smaller funds are generally higher risk.</li>
                </ul>
                The final risk level (LOW, MODERATE, HIGH, etc.) is determined by the overall score, and the needle points to the corresponding risk zone.
              </p>
              <p style={{ fontSize: 13, color: "#b91c1c" }}>
                This riskometer is for informational purposes only. Always consult a financial advisor before making investment decisions.
              </p>
            </div>
          </Modal.Body>
        </Modal>
      </Container>
      <style>{`
        .metric-label {
          font-size: 13px;
          color: #888;
          margin-bottom: 3px;
        }
      `}</style>
    </div>
  );
}

export default FundDetail;

