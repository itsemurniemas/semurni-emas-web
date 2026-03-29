"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Printer } from "lucide-react";
import NotaHeader from "@/components/receipt/nota-header";
import { GetTransactionById, TransactionDetail } from "@repo/core";
import { useAuth } from "@/context/AuthContext";
import { getApiConfigForRole } from "@/lib/api-config";

export default function ReceiptPage() {
  const params = useParams();
  const { user } = useAuth();
  const transactionId = params.id as string;

  const [transaction, setTransaction] = useState<TransactionDetail | null>(
    null,
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!transactionId || !user) return;

    const fetchTransaction = async () => {
      try {
        const useCase = new GetTransactionById(
          getApiConfigForRole(user.role || null),
        );
        const data = await useCase.execute(transactionId);
        setTransaction(data);
      } catch (error) {
        console.error("Failed to fetch transaction:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransaction();
  }, [transactionId, user]);
  return (
    <div
      style={{
        backgroundColor: "#f3f4f6",
        fontFamily: "Arial, sans-serif",
        padding: "20px",
        minHeight: "100vh",
        color: "#000",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "20px",
      }}
      className="receipt-wrapper"
    >
      <style>{`
        @media print {
          @page {
            size: A4;
            margin: 0;
          }
          html, body {
            margin: 0 !important;
            padding: 0 !important;
            width: 100% !important;
            height: auto !important;
          }
          nav, header, aside, footer, [class*="navbar"], [class*="sidebar"], [class*="header"] {
            display: none !important;
          }
          .receipt-wrapper {
            background-color: transparent !important;
            padding: 0 !important;
            margin: 0 !important;
            width: 100% !important;
          }
          .no-print {
            display: none !important;
          }
          .receipt-header {
            margin: 0 !important;
            padding: 0 !important;
          }
          thead tr {
            background-color: #DDD9C5 !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          th {
            background-color: #DDD9C5 !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          table:last-of-type thead tr {
            background-color: transparent !important;
          }
          table:last-of-type th {
            background-color: transparent !important;
          }
        }
        .receipt-page {
          width: 210mm;
          height: 297mm;
          background-color: white;
          box-sizing: border-box;
          overflow: hidden;
          page-break-inside: avoid;
          break-before: page;
          border: 2px solid #ccc;
        }
        @media print {
          .receipt-page {
            border: none !important;
          }
        }
      `}</style>
      {/* PAGE 1 */}
      <div
        className="receipt-page"
        style={{
          padding: "20px",
        }}
      >
        {/* Header */}
        <NotaHeader />

        {/* NOTA PEMBELIAN Title */}
        <div
          style={{
            textAlign: "center",
            margin: "20px 0",
            border: "2px solid #000",
            padding: "10px",
          }}
        >
          <h2 style={{ margin: "0", fontSize: "16px", fontWeight: "bold" }}>
            NOTA PEMBELIAN
          </h2>
        </div>

        {/* Customer Section */}
        <div
          style={{
            marginBottom: "20px",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
          }}
        >
          <div>
            <ul
              style={{
                listStyle: "none",
                padding: "0",
                margin: "0",
                fontSize: "13px",
              }}
            >
              <li style={{ marginBottom: "4px" }}>• Customer</li>
              <li style={{ marginBottom: "4px" }}>
                • Nama :{" "}
                {transaction?.customer?.name || "__________________________"}
              </li>
              <li style={{ marginBottom: "4px" }}>
                • Alamat:{" "}
                {transaction?.customer?.fullAddress ||
                  "__________________________"}
              </li>
              <li style={{ marginBottom: "4px" }}>
                • No.HP :{" "}
                {transaction?.customer?.telp || "__________________________"}
              </li>
            </ul>
          </div>
          <div style={{ fontSize: "13px" }}>
            <p style={{ margin: "0 0 8px 0" }}>
              Nomor Nota : {transaction?.id || "__________________________"}
            </p>
            <p style={{ margin: "0" }}>
              Tanggal :{" "}
              {transaction?.createdAt
                ? new Date(transaction.createdAt).toLocaleDateString("id-ID", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })
                : "__________________________"}
            </p>
          </div>
        </div>

        {/* Items Table */}
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            marginBottom: "20px",
          }}
        >
          <thead>
            <tr style={{ backgroundColor: "#DDD9C5" }}>
              <th
                style={{
                  border: "1px solid #000",
                  padding: "8px",
                  textAlign: "left",
                  fontWeight: "bold",
                  fontSize: "12px",
                }}
              >
                No
              </th>
              <th
                style={{
                  border: "1px solid #000",
                  padding: "8px",
                  textAlign: "left",
                  fontWeight: "bold",
                  fontSize: "12px",
                }}
              >
                Tipe Material
              </th>
              <th
                style={{
                  border: "1px solid #000",
                  padding: "8px",
                  textAlign: "center",
                  fontWeight: "bold",
                  fontSize: "12px",
                }}
              >
                Berat/pcs
              </th>
              <th
                style={{
                  border: "1px solid #000",
                  padding: "8px",
                  textAlign: "center",
                  fontWeight: "bold",
                  fontSize: "12px",
                }}
              >
                Harga
              </th>
              <th
                style={{
                  border: "1px solid #000",
                  padding: "8px",
                  textAlign: "center",
                  fontWeight: "bold",
                  fontSize: "12px",
                }}
              >
                Total Harga
              </th>
            </tr>
          </thead>
          <tbody>
            {[1, 2, 3].map((i) => (
              <tr key={i}>
                <td
                  style={{
                    border: "1px solid #000",
                    padding: "12px",
                    fontSize: "12px",
                  }}
                >
                  &nbsp;
                </td>
                <td
                  style={{
                    border: "1px solid #000",
                    padding: "12px",
                    fontSize: "12px",
                  }}
                >
                  &nbsp;
                </td>
                <td
                  style={{
                    border: "1px solid #000",
                    padding: "12px",
                    fontSize: "12px",
                  }}
                >
                  &nbsp;
                </td>
                <td
                  style={{
                    border: "1px solid #000",
                    padding: "12px",
                    fontSize: "12px",
                  }}
                >
                  &nbsp;
                </td>
                <td
                  style={{
                    border: "1px solid #000",
                    padding: "12px",
                    fontSize: "12px",
                  }}
                >
                  &nbsp;
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Note Section */}
        <div style={{ marginBottom: "20px", fontSize: "12px" }}>
          <ul style={{ listStyle: "none", padding: "0", margin: "0" }}>
            <li>• Note:</li>
          </ul>
        </div>

        {/* Terms & Conditions */}
        <div
          style={{
            border: "1px solid #000",
            padding: "15px",
            fontSize: "11px",
            lineHeight: "1.6",
          }}
        >
          <ol
            style={{
              margin: "0",
              paddingLeft: "15px",
              marginLeft: "0",
              listStyleType: "decimal",
            }}
          >
            <li style={{ marginBottom: "4px" }}>
              Barang yang dimaksud dalam nota ini adalah bempa{" "}
              <strong>
                Perhiasan, Logam Mulia, dan/atau Jenis Logam Lainnya.
              </strong>
            </li>
            <li style={{ marginBottom: "4px" }}>
              Barang yang telah dibeli/dijual tidak dapat dikembalikan{" "}
              <strong>dengan alasan apapun.</strong>
            </li>
            <li style={{ marginBottom: "4px" }}>
              Jika terjadi gangguan transaksi dari pihak kami dalam proses
              pencairan dana (baik secara transfer maupun tunai), penjual wajib
              bersedia menunggu maksimal <strong>2 (dua) jam</strong> sejak
              ditandatanganinya surat nota ini.
            </li>
            <li style={{ marginBottom: "4px" }}>
              Barang yang kami beli/jual harus disertai dengan{" "}
              <strong>data pribadi penjual/pembeli</strong> yang valid, seperti{" "}
              <strong>KTP/SIM/Pasport.</strong>
            </li>
            <li style={{ marginBottom: "4px" }}>
              Kami <strong>tidak bertanggung jawab</strong> secara hukum perdata
              maupun pidana apabila di kemudian hari terbukti bahwa barang yang
              dijual/dibeli merupakan{" "}
              <strong>hasil tindak pidana atau dalam sengketa hukum.</strong>
            </li>
            <li style={{ marginBottom: "4px" }}>
              Kami <strong>tidak bertanggung jawab</strong> atas segala risiko
              hukum apabila di kemudian hari transaksi ini menimbulkan masalah
              hukum berdasarkan peraturan perundang-undangan yang berlaku.
            </li>
            <li style={{ marginBottom: "4px" }}>
              Barang yang telah dibongkar, dipisahkan, dirusak, atau
              dimodifikasi <strong>tidak dapat dikembalikan</strong> dalam
              kondisi semula.
            </li>
            <li style={{ marginBottom: "4px" }}>
              Penjual telah menyetujui bahwa barang yang akan dijual dapat
              dicek, atau diuji kandungannya, baik logam maupun batu permata
              atau bahan lainnya yang melekat pada perhiasan tersebut.
            </li>
            <li style={{ marginBottom: "4px" }}>
              Bagian tambahan pada barang seperti{" "}
              <strong>batu permata, berlian, zirkonia,</strong> dan/atau
              sejenisnya yang melekat pada barang baik secara tetap maupun
              terpisah, akan dianggap sebagai{" "}
              <strong>bagian dari perhiasan</strong> yang dijual.
            </li>
            <li>
              Penjual wajib menyatakan asal-usul barang yang dijual secara{" "}
              <strong>tertulis</strong> dengan melampirkan dokumen pendukung
              (jika ada) atau surat kuasa bermaterai apabila diwakilkan oleh
              pihak lain.
            </li>
          </ol>
        </div>
      </div>

      {/* PAGE 2 */}
      <div
        className="receipt-page"
        style={{
          padding: "20px",
        }}
      >
        {/* Header */}
        <NotaHeader />

        {/* Asal Usul Barang Section */}
        <div
          style={{
            border: "1px solid #000",
            padding: "15px",
            marginBottom: "20px",
            fontSize: "12px",
          }}
        >
          <h3
            style={{
              margin: "0 0 12px 0",
              fontSize: "13px",
              fontWeight: "bold",
            }}
          >
            Asal Usul Barang:
          </h3>
          <ul style={{ listStyle: "none", padding: "0", margin: "0 0 15px 0" }}>
            <li style={{ marginBottom: "6px" }}>
              • <strong>Pribadi</strong>
            </li>
            <li>
              • <strong>Lainnya:</strong> ____________________ (wajib disertal
              kuasa jual bermaterai dari pemilik asli)
            </li>
          </ul>

          <h3
            style={{
              margin: "15px 0 12px 0",
              fontSize: "13px",
              fontWeight: "bold",
            }}
          >
            Detail Asal Usul Barang:
          </h3>
          <ul style={{ listStyle: "none", padding: "0", margin: "0" }}>
            <li style={{ marginBottom: "6px" }}>
              • <strong>Nama Toko</strong> : ____________________
            </li>
            <li style={{ marginBottom: "6px" }}>
              • <strong>Tempat Pembelian</strong> : ____________________
            </li>
            <li>
              • <strong>Tahun Pembelian</strong> : ____________________
            </li>
          </ul>
        </div>

        {/* Signature Section */}
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            marginTop: "30px",
          }}
        >
          <thead>
            <tr>
              <th
                style={{
                  border: "1px solid #000",
                  padding: "10px",
                  textAlign: "center",
                  fontWeight: "bold",
                  fontSize: "12px",
                }}
              >
                Pemilik Barang
              </th>
              <th
                style={{
                  border: "1px solid #000",
                  padding: "10px",
                  textAlign: "center",
                  fontWeight: "bold",
                  fontSize: "12px",
                }}
              >
                Diterima Oleh
              </th>
              <th
                style={{
                  border: "1px solid #000",
                  padding: "10px",
                  textAlign: "center",
                  fontWeight: "bold",
                  fontSize: "12px",
                }}
              >
                Diperiksa Oleh
              </th>
              <th
                style={{
                  border: "1px solid #000",
                  padding: "10px",
                  textAlign: "center",
                  fontWeight: "bold",
                  fontSize: "12px",
                }}
              >
                Dibayar Oleh
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td
                style={{
                  border: "1px solid #000",
                  padding: "60px 10px",
                  textAlign: "center",
                  fontSize: "12px",
                }}
              >
                <div
                  style={{ marginTop: "20px", fontSize: "10px", color: "#666" }}
                >
                  .......................
                </div>
              </td>
              <td
                style={{
                  border: "1px solid #000",
                  padding: "60px 10px",
                  textAlign: "center",
                  fontSize: "12px",
                }}
              >
                <div
                  style={{ marginTop: "20px", fontSize: "10px", color: "#666" }}
                >
                  .......................
                </div>
              </td>
              <td
                style={{
                  border: "1px solid #000",
                  padding: "60px 10px",
                  textAlign: "center",
                  fontSize: "12px",
                }}
              >
                <div
                  style={{ marginTop: "20px", fontSize: "10px", color: "#666" }}
                >
                  .......................
                </div>
              </td>
              <td
                style={{
                  border: "1px solid #000",
                  padding: "60px 10px",
                  textAlign: "center",
                  fontSize: "12px",
                }}
              >
                <div
                  style={{ marginTop: "20px", fontSize: "10px", color: "#666" }}
                >
                  .......................
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Print Button */}
      <div
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
        }}
        className="no-print"
      >
        <button
          onClick={() => window.print()}
          style={{
            padding: "12px 24px",
            backgroundColor: "#3b82f6",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontSize: "14px",
            fontWeight: "600",
            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <Printer size={16} />
          Print
        </button>
      </div>
    </div>
  );
}
