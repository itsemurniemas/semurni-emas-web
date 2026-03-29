"use client";

import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../ui/table";
import { DashboardMetalPriceListProps } from "./data";
import { formatRupiah } from "@repo/core/extension/number";
import Button from "@/components/ui/button/Button";
import SegmentedPicker from "../../common/SegmentedPicker";

const DashboardMetalPriceList: React.FC<DashboardMetalPriceListProps> = ({
  title,
  priceList,
  onTapEdit,
  onTapDelete,
  onTapPrice,
  isSuperAdmin = false,
}) => {
  const [transactionType, setTransactionType] = useState<"buy" | "sell">("buy");
  const [category, setCategory] = useState<
    "goldBar" | "goldJewelry" | "others"
  >("goldBar");

  // Get the array of items based on the active category
  const activeItems =
    category === "goldBar"
      ? priceList.goldBarPriceList
      : category === "goldJewelry"
        ? priceList.goldJewelryPriceList
        : priceList.othersPriceList;

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/3 sm:px-6">
      <div className="flex flex-col gap-4 mb-4">
        <div className="flex items-center justify-between">
          {title && (
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
              {title}
            </h3>
          )}
        </div>

        <div className="flex flex-col gap-3 w-full">
          {isSuperAdmin && (
            <SegmentedPicker
              options={[
                { label: "Harga Kami Beli", value: "buy" },
                { label: "Harga Kami Jual", value: "sell" },
              ]}
              value={transactionType}
              onChange={(val: string) =>
                setTransactionType(val as "buy" | "sell")
              }
              width="fit"
            />
          )}
          <SegmentedPicker
            options={[
              { label: "Batangan Logam Mulia", value: "goldBar" },
              { label: "Perhiasan Emas", value: "goldJewelry" },
              { label: "Perhiasan Non Emas", value: "others" },
            ]}
            value={category}
            onChange={(val: string) =>
              setCategory(val as "goldBar" | "goldJewelry" | "others")
            }
          />
        </div>
      </div>

      <div className="max-w-full overflow-x-auto">
        <Table>
          <TableHeader className="border-gray-200 dark:border-gray-700 border-y">
            <TableRow>
              <TableCell
                isHeader
                className="flex-1 p-3 font-bold text-gray-500 text-start text-theme-sm dark:text-gray-400 bg-white dark:bg-slate-950"
              >
                Produk 1
              </TableCell>

              {category === "others" ? (
                <>
                  <TableCell
                    isHeader
                    className="flex-1 p-3 font-bold text-gray-500 text-center text-theme-sm dark:text-gray-400 bg-white dark:bg-slate-950"
                  >
                    Harga Low Quality
                  </TableCell>
                  <TableCell
                    isHeader
                    className="flex-1 p-3 font-bold text-gray-500 text-center text-theme-sm dark:text-gray-400 bg-white dark:bg-slate-950"
                  >
                    Harga High Quality
                  </TableCell>
                </>
              ) : (
                <TableCell
                  isHeader
                  className="flex-1 p-3 font-bold text-gray-500 text-end text-theme-sm dark:text-gray-400 bg-white dark:bg-slate-950"
                >
                  Harga
                </TableCell>
              )}

              {onTapEdit && (
                <TableCell
                  isHeader
                  className="p-3 font-bold text-gray-500 text-end text-theme-sm dark:text-gray-400 bg-white dark:bg-slate-950"
                >
                  Aksi
                </TableCell>
              )}

              <TableCell
                isHeader
                className="flex-1 p-3 font-bold text-gray-500 text-start text-theme-sm dark:text-gray-400 bg-gray-100 dark:bg-gray-900/20"
              >
                Produk 2
              </TableCell>

              {category === "others" ? (
                <>
                  <TableCell
                    isHeader
                    className="flex-1 p-3 font-bold text-gray-500 text-center text-theme-sm dark:text-gray-400 bg-gray-100 dark:bg-gray-900/20"
                  >
                    Harga Low Quality
                  </TableCell>
                  <TableCell
                    isHeader
                    className="flex-1 p-3 font-bold text-gray-500 text-center text-theme-sm dark:text-gray-400 bg-gray-100 dark:bg-gray-900/20"
                  >
                    Harga High Quality
                  </TableCell>
                </>
              ) : (
                <TableCell
                  isHeader
                  className="flex-1 p-3 font-bold text-gray-500 text-end text-theme-sm dark:text-gray-400 bg-gray-100 dark:bg-gray-900/20"
                >
                  Harga
                </TableCell>
              )}

              {onTapEdit && (
                <TableCell
                  isHeader
                  className="p-3 font-bold text-gray-500 text-end text-theme-sm dark:text-gray-400 bg-gray-100 dark:bg-gray-900/20"
                >
                  Aksi
                </TableCell>
              )}
            </TableRow>
          </TableHeader>

          <TableBody className="divide-y divide-gray-200 dark:divide-gray-700">
            {activeItems && activeItems.length > 0 ? (
              Array.from({ length: Math.ceil(activeItems.length / 2) }).map(
                (_, rowIdx) => {
                  const product1 = activeItems[rowIdx * 2];
                  const product2 = activeItems[rowIdx * 2 + 1];
                  const priceData1 =
                    transactionType === "buy"
                      ? product1.buyPrice
                      : product1.sellPrice;
                  const priceData2 = product2
                    ? transactionType === "buy"
                      ? product2.buyPrice
                      : product2.sellPrice
                    : null;

                  return (
                    <TableRow key={rowIdx}>
                      {/* Product 1 */}
                      <TableCell className="flex-1 p-3 bg-white dark:bg-slate-950">
                        <p className="font-medium text-gray-800 text-theme-sm dark:text-white/90">
                          {product1.name}
                        </p>
                      </TableCell>

                      {category === "others" ? (
                        <>
                          <TableCell className="flex-1 p-3 text-center text-gray-500 text-theme-sm dark:text-gray-400 bg-white dark:bg-slate-950">
                            <div>
                              {priceData1.lowQualityPrice !== null
                                ? formatRupiah(
                                    priceData1.lowQualityPrice,
                                    true,
                                    0,
                                  )
                                : "-"}
                            </div>
                          </TableCell>
                          <TableCell className="flex-1 p-3 text-center text-gray-500 text-theme-sm dark:text-gray-400 bg-white dark:bg-slate-950">
                            <div>
                              {priceData1.highQualityPrice !== null
                                ? formatRupiah(
                                    priceData1.highQualityPrice,
                                    true,
                                    0,
                                  )
                                : "-"}
                            </div>
                          </TableCell>
                        </>
                      ) : (
                        <TableCell className="flex-1 p-3 text-end text-gray-500 text-theme-sm dark:text-gray-400 bg-white dark:bg-slate-950">
                          <div>
                            {priceData1.price !== null
                              ? formatRupiah(priceData1.price, true, 0)
                              : "-"}
                          </div>
                        </TableCell>
                      )}

                      {/* Product 1 Actions */}
                      {onTapEdit && (
                        <TableCell className="p-3 text-end text-gray-500 text-theme-sm dark:text-gray-400 bg-white dark:bg-slate-950">
                          <div className="flex justify-end gap-2">
                            {onTapEdit && (
                              <Button
                                size="sm"
                                className="w-auto h-8"
                                onClick={() => {
                                  onTapEdit(product1);
                                }}
                              >
                                Edit
                              </Button>
                            )}

                            {onTapDelete && (
                              <Button
                                size="sm"
                                variant="outline"
                                className="w-auto h-8"
                                onClick={() => {
                                  onTapDelete(product1);
                                }}
                              >
                                Delete
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      )}

                      {/* Product 2 */}
                      {product2 ? (
                        <>
                          <TableCell className="flex-1 p-3 bg-gray-100 dark:bg-gray-900/20">
                            <p className="font-medium text-gray-800 text-theme-sm dark:text-white/90">
                              {product2.name}
                            </p>
                          </TableCell>

                          {category === "others" ? (
                            <>
                              <TableCell className="flex-1 p-3 text-center text-gray-500 text-theme-sm dark:text-gray-400 bg-gray-100 dark:bg-gray-900/20">
                                <div>
                                  {priceData2 &&
                                  priceData2.lowQualityPrice !== null
                                    ? formatRupiah(
                                        priceData2.lowQualityPrice,
                                        true,
                                        0,
                                      )
                                    : "-"}
                                </div>
                              </TableCell>
                              <TableCell className="flex-1 p-3 text-center text-gray-500 text-theme-sm dark:text-gray-400 bg-gray-100 dark:bg-gray-900/20">
                                <div>
                                  {priceData2 &&
                                  priceData2.highQualityPrice !== null
                                    ? formatRupiah(
                                        priceData2.highQualityPrice,
                                        true,
                                        0,
                                      )
                                    : "-"}
                                </div>
                              </TableCell>
                            </>
                          ) : (
                            <TableCell className="flex-1 p-3 text-end text-gray-500 text-theme-sm dark:text-gray-400 bg-gray-100 dark:bg-gray-900/20">
                              <div>
                                {priceData2 && priceData2.price !== null
                                  ? formatRupiah(priceData2.price, true, 0)
                                  : "-"}
                              </div>
                            </TableCell>
                          )}

                          {onTapEdit && (
                            <TableCell className="p-3 text-end text-gray-500 text-theme-sm dark:text-gray-400 bg-gray-100 dark:bg-gray-900/20">
                              <div className="flex justify-end gap-2">
                                {onTapEdit && (
                                  <Button
                                    size="sm"
                                    className="w-auto h-8"
                                    onClick={() => {
                                      onTapEdit(product2);
                                    }}
                                  >
                                    Edit
                                  </Button>
                                )}

                                {onTapDelete && (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="w-auto h-8"
                                    onClick={() => {
                                      onTapDelete(product2);
                                    }}
                                  >
                                    Delete
                                  </Button>
                                )}
                              </div>
                            </TableCell>
                          )}
                        </>
                      ) : (
                        <>
                          <TableCell className="flex-1 p-3 bg-gray-100 dark:bg-gray-900/20">
                            <div />
                          </TableCell>
                          {category === "others" ? (
                            <>
                              <TableCell className="flex-1 p-3 bg-gray-100 dark:bg-gray-900/20">
                                <div />
                              </TableCell>
                              <TableCell className="flex-1 p-3 bg-gray-100 dark:bg-gray-900/20">
                                <div />
                              </TableCell>
                            </>
                          ) : (
                            <TableCell className="flex-1 p-3 bg-gray-100 dark:bg-gray-900/20">
                              <div />
                            </TableCell>
                          )}
                          {onTapEdit && (
                            <TableCell className="p-3 bg-gray-100 dark:bg-gray-900/20">
                              <div />
                            </TableCell>
                          )}
                        </>
                      )}

                      {/* Action buttons for Product 1 (only show if no Product 2) */}
                      {!product2 && onTapEdit && (
                        <TableCell className="p-3 text-end text-gray-500 text-theme-sm dark:text-gray-400">
                          <div className="flex justify-end gap-2">
                            {onTapEdit && (
                              <Button
                                size="sm"
                                className="w-auto h-8"
                                onClick={() => {
                                  onTapEdit(product1);
                                }}
                              >
                                Edit
                              </Button>
                            )}

                            {onTapDelete && (
                              <Button
                                size="sm"
                                variant="outline"
                                className="w-auto h-8"
                                onClick={() => {
                                  onTapDelete(product1);
                                }}
                              >
                                Delete
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      )}
                    </TableRow>
                  );
                },
              )
            ) : (
              <TableRow>
                <TableCell
                  colSpan={category === "others" ? 10 : 6}
                  className="py-12 text-center text-muted-foreground"
                >
                  Tidak ada data tersedia untuk kategori ini.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default DashboardMetalPriceList;
