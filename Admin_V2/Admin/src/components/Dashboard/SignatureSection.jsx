import React from "react";

const SignatureSection = () => {
  return (
    <>
      <div className="signature-section">
        <div className="signature-box">
          <div className="line"></div>
          <p>Prepared By</p>
        </div>

        <div className="signature-box">
          <div className="line"></div>
          <p>Checked By</p>
        </div>

        <div className="signature-box">
          <div className="line"></div>
          <p>Verified By</p>
        </div>

        <div className="signature-box">
          <div className="line"></div>
          <p>Approved By</p>
        </div>
      </div>

      <style>{`
        .signature-section{
          display:flex;
          justify-content:space-between;
          align-items:flex-end;
          width:100%;
          margin-top:40px;
          page-break-inside:avoid;
          break-inside:avoid;
        }

        .signature-box{
          width:22%;
          text-align:center;
        }

        .signature-box .line{
          border-top:1px solid #000;
          margin-bottom:6px;
        }

        .signature-box p{
          margin:0;
          font-size:12px;
          font-weight:600;
        }

        @media print{
          .signature-section{
            page-break-inside:avoid;
            break-inside:avoid;
          }
        }
      `}</style>
    </>
  );
};

export default SignatureSection;