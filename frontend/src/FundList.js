// Updated FundList with search and background
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Card,
  Spinner,
  Badge,
  Button,
  Form,
} from "react-bootstrap";
import { FaSearch } from "react-icons/fa";

const COLORS = ["#007bff", "#28a745", "#fd7e14", "#6f42c1", "#17a2b8", "#ffc107"];

function FundList() {
  const [funds, setFunds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    axios.get("http://127.0.0.1:8000/api/funds/")
      .then(response => setFunds(response.data))
      .finally(() => setLoading(false));
  }, []);

  const filteredFunds = funds.filter(fund =>
    fund.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ background: "#fef9ed", minHeight: "100vh" }}>
      <Container className="py-5">
        <h1 className="mb-3 text-center" style={{ fontWeight: 700, color: "#003366" }}>
          Fund-Screener
        </h1>
        <p className="text-center mb-4" style={{ color: "#555" }}>
          Discover mutual funds with detailed analytics and performance indicators.
        </p>

        {/* Search Bar */}
        <Form className="mb-4 d-flex justify-content-center">
          <Form.Control
            type="text"
            placeholder="Search funds by name..."
            style={{ maxWidth: "400px" }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Form>

        {loading ? (
          <div className="d-flex justify-content-center">
            <Spinner animation="border" />
          </div>
        ) : (
          <Row xs={1} sm={2} md={3} lg={4} className="g-4">
            {filteredFunds.map((fund, idx) => (
              <Col key={fund.id}>
                <Card className="h-100 fund-card shadow-sm">
                  <Card.Body>
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <div>
                        <div className="text-muted" style={{ fontSize: "0.8em" }}>
                          {fund.amc_name || "AMC Name"}
                        </div>
                        <Card.Title className="mb-1" style={{ fontSize: "1.05rem", fontWeight: 600 }}>
                          {fund.name}
                        </Card.Title>
                        <div className="text-muted" style={{ fontSize: "0.85em" }}>
                          {fund.plan || "Regular - Growth"}
                        </div>
                      </div>
                      <img
                        src="https://www.icicipruamc.com/blob/riskometer/small/veryHigh.png"
                        alt="logo"
                        width={25}
                        height={25}
                        style={{ borderRadius: "50%" }}
                      />
                    </div>

                    <div className="mb-2">
                      <Badge bg="primary" className="me-2">{(fund.primary_badge&&fund.primary_badge.toUpperCase())|| "NFO" }</Badge>
                      <Badge bg="secondary">{fund.market_cap.toUpperCase() || "NFO"}</Badge>
                    </div>

                    <div className="my-3">
                      <div className="text-muted" style={{ fontSize: "0.8em" }}>Sharpe Ratio</div>
                      <Badge
                        bg={
                          fund.sharpe_ratio > 1
                            ? "success"
                            : Math.abs(fund.sharpe_ratio - 1) <= 0.2
                              ? "warning"
                              : "danger"
                        }
                        className="px-2 py-1"
                      >
                        {fund.sharpe_ratio}
                      </Badge>
                    </div>

                    <div className="mt-3">
                      <div className="text-muted" style={{ fontSize: "0.8em" }}>CAGR  
                        <img src = "https://upload.wikimedia.org/wikipedia/en/thumb/3/35/Information_icon.svg/2048px-Information_icon.svg.png" 
                          title="Compound Annual Growth Rate"
                          alt = "info"
                          style={{  width: "14px", marginLeft: "6px", cursor: "pointer", marginBottom: "2px" }}
                        />  
                                     
                      </div>
                      <div style={{ fontWeight: 600 }}>
                        {fund.cagr ? `${fund.cagr}%` : "17.1%"}
                      </div>
                    </div>
                  </Card.Body>

                  <Card.Footer className="bg-white border-top-0 d-flex justify-content-between align-items-center">
                    <Link to={`/fund/${fund.id}`}>
                      <Button size="sm" variant="outline-primary">
                        View Details
                      </Button>
                    </Link>
                    <Link to={`/fund/${fund.id}`}>
                    <Button size="sm" variant="warning" style={{ color: "white" }}>
                      INVEST
                    </Button></Link>
                  </Card.Footer>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </Container>

      {/* Extra Styling */}
      <style>{`
        .fund-card {
          border-radius: 16px;
          border: 1px solid #f0f0f0;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
          background: white;
        }

        .fund-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 12px 24px rgba(0,0,0,0.08);
        }
      `}</style>
    </div>
  );
}

export default FundList;
