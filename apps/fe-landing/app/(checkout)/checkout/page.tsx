"use client";

import { useState } from "react";
import { Minus, Plus, CreditCard, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import Image from "next/image";
import pantheonImage from "@/assets/pantheon.jpg";
import eclipseImage from "@/assets/eclipse.jpg";

const CheckoutPage = () => {
  const [showDiscountInput, setShowDiscountInput] = useState(false);
  const [discountCode, setDiscountCode] = useState("");
  const [customerDetails, setCustomerDetails] = useState({
    email: "",
    firstName: "",
    lastName: "",
    phone: "",
  });
  const [shippingAddress, setShippingAddress] = useState({
    address: "",
    city: "",
    postalCode: "",
    country: "",
  });
  const [hasSeparateBilling, setHasSeparateBilling] = useState(false);
  const [billingDetails, setBillingDetails] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    country: "",
  });
  const [shippingOption, setShippingOption] = useState("standard");
  const [paymentDetails, setPaymentDetails] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardholderName: "",
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentComplete, setPaymentComplete] = useState(false);

  // Mock cart data - in a real app this would come from state management
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "Cincin Pantheon",
      price: "Rp 2.450.000",
      quantity: 1,
      image: pantheonImage,
      size: "54 EU / 7 US",
    },
    {
      id: 2,
      name: "Anting Eclipse",
      price: "Rp 1.850.000",
      quantity: 1,
      image: eclipseImage,
    },
  ]);

  const updateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      setCartItems((items) => items.filter((item) => item.id !== id));
    } else {
      setCartItems((items) =>
        items.map((item) =>
          item.id === id ? { ...item, quantity: newQuantity } : item
        )
      );
    }
  };

  const subtotal = cartItems.reduce((sum, item) => {
    const price = parseInt(item.price.replace(/\D/g, ""));
    return sum + price * item.quantity;
  }, 0);

  const getShippingCost = () => {
    switch (shippingOption) {
      case "express":
        return 50000;
      case "overnight":
        return 150000;
      default:
        return 0; // Standar pengiriman gratis
    }
  };

  const shipping = getShippingCost();
  const total = subtotal + shipping;

  const handleDiscountSubmit = () => {
    // Handle discount code submission
    console.log("Discount code submitted:", discountCode);
    setShowDiscountInput(false);
  };

  const handleCustomerDetailsChange = (field: string, value: string) => {
    setCustomerDetails((prev) => ({ ...prev, [field]: value }));
  };

  const handleShippingAddressChange = (field: string, value: string) => {
    setShippingAddress((prev) => ({ ...prev, [field]: value }));
  };

  const handleBillingDetailsChange = (field: string, value: string) => {
    setBillingDetails((prev) => ({ ...prev, [field]: value }));
  };

  const handlePaymentDetailsChange = (field: string, value: string) => {
    setPaymentDetails((prev) => ({ ...prev, [field]: value }));
  };

  const handleCompleteOrder = async () => {
    setIsProcessing(true);

    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setIsProcessing(false);
    setPaymentComplete(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="pt-16 pb-12 section-container">
        <div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Order Summary - First on mobile, last on desktop */}
            <div className="lg:col-span-1 lg:order-2">
              <div className="bg-muted/20 p-8 rounded-none sticky top-6">
                <h2 className="text-lg font-light text-foreground mb-6">
                  Ringkasan Pesanan
                </h2>

                <div className="space-y-6">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex gap-4">
                      <div className="w-20 h-20 bg-muted rounded-none overflow-hidden relative">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-light text-foreground">
                          {item.name}
                        </h3>
                        {item.size && (
                          <p className="text-sm text-muted-foreground">
                            Ukuran: {item.size}
                          </p>
                        )}

                        {/* Quantity controls */}
                        <div className="flex items-center gap-2 mt-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              updateQuantity(item.id, item.quantity - 1)
                            }
                            className="h-8 w-8 p-0 rounded-none border-muted-foreground/20"
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="text-sm font-medium text-foreground min-w-[2ch] text-center">
                            {item.quantity}
                          </span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              updateQuantity(item.id, item.quantity + 1)
                            }
                            className="h-8 w-8 p-0 rounded-none border-muted-foreground/20"
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      <div className="text-foreground font-medium">
                        {item.price}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Discount Code Section */}
                <div className="mt-8 pt-6 border-t border-muted-foreground/20">
                  {!showDiscountInput ? (
                    <button
                      onClick={() => setShowDiscountInput(true)}
                      className="text-sm text-foreground underline hover:no-underline transition-all"
                    >
                      Kode diskon
                    </button>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex gap-2">
                        <Input
                          type="text"
                          value={discountCode}
                          onChange={(e) => setDiscountCode(e.target.value)}
                          placeholder="Masukkan kode diskon"
                          className="flex-1 rounded-none"
                        />
                        <button
                          onClick={handleDiscountSubmit}
                          className="text-sm text-foreground underline hover:no-underline transition-all px-2"
                        >
                          Gunakan
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <div className="border-t border-muted-foreground/20 mt-4 pt-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="text-foreground">
                      Rp {subtotal.toLocaleString("id-ID")}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Left Column - Forms */}
            <div className="lg:col-span-2 lg:order-1 space-y-8">
              {/* Customer Details Form */}
              <div className="bg-muted/20 p-8 rounded-none">
                <h2 className="text-lg font-light text-foreground mb-6">
                  Detail Pelanggan
                </h2>

                <div className="space-y-6">
                  <div>
                    <Label
                      htmlFor="email"
                      className="text-sm font-light text-foreground"
                    >
                      Alamat Email *
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={customerDetails.email}
                      onChange={(e) =>
                        handleCustomerDetailsChange("email", e.target.value)
                      }
                      className="mt-2 rounded-none"
                      placeholder="Masukkan alamat email Anda"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label
                        htmlFor="firstName"
                        className="text-sm font-light text-foreground"
                      >
                        Nama Depan *
                      </Label>
                      <Input
                        id="firstName"
                        type="text"
                        value={customerDetails.firstName}
                        onChange={(e) =>
                          handleCustomerDetailsChange(
                            "firstName",
                            e.target.value
                          )
                        }
                        className="mt-2 rounded-none"
                        placeholder="Nama depan"
                      />
                    </div>
                    <div>
                      <Label
                        htmlFor="lastName"
                        className="text-sm font-light text-foreground"
                      >
                        Nama Belakang *
                      </Label>
                      <Input
                        id="lastName"
                        type="text"
                        value={customerDetails.lastName}
                        onChange={(e) =>
                          handleCustomerDetailsChange(
                            "lastName",
                            e.target.value
                          )
                        }
                        className="mt-2 rounded-none"
                        placeholder="Nama belakang"
                      />
                    </div>
                  </div>

                  <div>
                    <Label
                      htmlFor="phone"
                      className="text-sm font-light text-foreground"
                    >
                      Nomor Telepon
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={customerDetails.phone}
                      onChange={(e) =>
                        handleCustomerDetailsChange("phone", e.target.value)
                      }
                      className="mt-2 rounded-none"
                      placeholder="Masukkan nomor telepon Anda"
                    />
                  </div>

                  {/* Shipping Address */}
                  <div className="border-t border-muted-foreground/20 pt-6 mt-8">
                    <h3 className="text-base font-light text-foreground mb-4">
                      Alamat Pengiriman
                    </h3>

                    <div className="space-y-4">
                      <div>
                        <Label
                          htmlFor="shippingAddress"
                          className="text-sm font-light text-foreground"
                        >
                          Alamat *
                        </Label>
                        <Input
                          id="shippingAddress"
                          type="text"
                          value={shippingAddress.address}
                          onChange={(e) =>
                            handleShippingAddressChange(
                              "address",
                              e.target.value
                            )
                          }
                          className="mt-2 rounded-none"
                          placeholder="Alamat lengkap (Nama jalan, nomor rumah)"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label
                            htmlFor="shippingCity"
                            className="text-sm font-light text-foreground"
                          >
                            Kota *
                          </Label>
                          <Input
                            id="shippingCity"
                            type="text"
                            value={shippingAddress.city}
                            onChange={(e) =>
                              handleShippingAddressChange(
                                "city",
                                e.target.value
                              )
                            }
                            className="mt-2 rounded-none"
                            placeholder="Kota"
                          />
                        </div>
                        <div>
                          <Label
                            htmlFor="shippingPostalCode"
                            className="text-sm font-light text-foreground"
                          >
                            Kode Pos *
                          </Label>
                          <Input
                            id="shippingPostalCode"
                            type="text"
                            value={shippingAddress.postalCode}
                            onChange={(e) =>
                              handleShippingAddressChange(
                                "postalCode",
                                e.target.value
                              )
                            }
                            className="mt-2 rounded-none"
                            placeholder="Kode pos"
                          />
                        </div>
                      </div>

                      <div>
                        <Label
                          htmlFor="shippingCountry"
                          className="text-sm font-light text-foreground"
                        >
                          Negara *
                        </Label>
                        <Input
                          id="shippingCountry"
                          type="text"
                          value={shippingAddress.country}
                          onChange={(e) =>
                            handleShippingAddressChange(
                              "country",
                              e.target.value
                            )
                          }
                          className="mt-2 rounded-none"
                          placeholder="Negara"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Billing Address Checkbox */}
                  <div className="border-t border-muted-foreground/20 pt-6 mt-8">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="separateBilling"
                        checked={hasSeparateBilling}
                        onCheckedChange={(checked) =>
                          setHasSeparateBilling(checked === true)
                        }
                      />
                      <Label
                        htmlFor="separateBilling"
                        className="text-sm font-light text-foreground cursor-pointer"
                      >
                        Alamat penagihan berbeda
                      </Label>
                    </div>
                  </div>

                  {/* Billing Details - shown when checkbox is checked */}
                  {hasSeparateBilling && (
                    <div className="space-y-6 pt-4">
                      <h3 className="text-base font-light text-foreground">
                        Detail Penagihan
                      </h3>

                      <div>
                        <Label
                          htmlFor="billingEmail"
                          className="text-sm font-light text-foreground"
                        >
                          Alamat Email *
                        </Label>
                        <Input
                          id="billingEmail"
                          type="email"
                          value={billingDetails.email}
                          onChange={(e) =>
                            handleBillingDetailsChange("email", e.target.value)
                          }
                          className="mt-2 rounded-none"
                          placeholder="Masukkan email penagihan"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label
                            htmlFor="billingFirstName"
                            className="text-sm font-light text-foreground"
                          >
                            Nama Depan *
                          </Label>
                          <Input
                            id="billingFirstName"
                            type="text"
                            value={billingDetails.firstName}
                            onChange={(e) =>
                              handleBillingDetailsChange(
                                "firstName",
                                e.target.value
                              )
                            }
                            className="mt-2 rounded-none"
                            placeholder="Nama depan"
                          />
                        </div>
                        <div>
                          <Label
                            htmlFor="billingLastName"
                            className="text-sm font-light text-foreground"
                          >
                            Nama Belakang *
                          </Label>
                          <Input
                            id="billingLastName"
                            type="text"
                            value={billingDetails.lastName}
                            onChange={(e) =>
                              handleBillingDetailsChange(
                                "lastName",
                                e.target.value
                              )
                            }
                            className="mt-2 rounded-none"
                            placeholder="Nama belakang"
                          />
                        </div>
                      </div>

                      <div>
                        <Label
                          htmlFor="billingPhone"
                          className="text-sm font-light text-foreground"
                        >
                          Nomor Telepon
                        </Label>
                        <Input
                          id="billingPhone"
                          type="tel"
                          value={billingDetails.phone}
                          onChange={(e) =>
                            handleBillingDetailsChange("phone", e.target.value)
                          }
                          className="mt-2 rounded-none"
                          placeholder="Masukkan nomor telepon penagihan"
                        />
                      </div>

                      <div>
                        <Label
                          htmlFor="billingAddress"
                          className="text-sm font-light text-foreground"
                        >
                          Alamat *
                        </Label>
                        <Input
                          id="billingAddress"
                          type="text"
                          value={billingDetails.address}
                          onChange={(e) =>
                            handleBillingDetailsChange(
                              "address",
                              e.target.value
                            )
                          }
                          className="mt-2 rounded-none"
                          placeholder="Alamat lengkap"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label
                            htmlFor="billingCity"
                            className="text-sm font-light text-foreground"
                          >
                            Kota *
                          </Label>
                          <Input
                            id="billingCity"
                            type="text"
                            value={billingDetails.city}
                            onChange={(e) =>
                              handleBillingDetailsChange("city", e.target.value)
                            }
                            className="mt-2 rounded-none"
                            placeholder="Kota"
                          />
                        </div>
                        <div>
                          <Label
                            htmlFor="billingPostalCode"
                            className="text-sm font-light text-foreground"
                          >
                            Kode Pos *
                          </Label>
                          <Input
                            id="billingPostalCode"
                            type="text"
                            value={billingDetails.postalCode}
                            onChange={(e) =>
                              handleBillingDetailsChange(
                                "postalCode",
                                e.target.value
                              )
                            }
                            className="mt-2 rounded-none"
                            placeholder="Kode pos"
                          />
                        </div>
                      </div>

                      <div>
                        <Label
                          htmlFor="billingCountry"
                          className="text-sm font-light text-foreground"
                        >
                          Negara *
                        </Label>
                        <Input
                          id="billingCountry"
                          type="text"
                          value={billingDetails.country}
                          onChange={(e) =>
                            handleBillingDetailsChange(
                              "country",
                              e.target.value
                            )
                          }
                          className="mt-2 rounded-none"
                          placeholder="Negara"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Shipping Options */}
              <div className="bg-muted/20 p-8 rounded-none">
                <h2 className="text-lg font-light text-foreground mb-6">
                  Pilihan Pengiriman
                </h2>

                <RadioGroup
                  value={shippingOption}
                  onValueChange={setShippingOption}
                  className="space-y-4"
                >
                  <div className="flex items-center justify-between p-4 border border-muted-foreground/20 rounded-none">
                    <div className="flex items-center space-x-3">
                      <RadioGroupItem value="standard" id="standard" />
                      <Label
                        htmlFor="standard"
                        className="font-light text-foreground"
                      >
                        Pengiriman Standar
                      </Label>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Gratis • 3-5 hari kerja
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 border border-muted-foreground/20 rounded-none">
                    <div className="flex items-center space-x-3">
                      <RadioGroupItem value="express" id="express" />
                      <Label
                        htmlFor="express"
                        className="font-light text-foreground"
                      >
                        Pengiriman Ekspres
                      </Label>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Rp 50.000 • 1-2 hari kerja
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 border border-muted-foreground/20 rounded-none">
                    <div className="flex items-center space-x-3">
                      <RadioGroupItem value="overnight" id="overnight" />
                      <Label
                        htmlFor="overnight"
                        className="font-light text-foreground"
                      >
                        Pengiriman Sehari Sampai
                      </Label>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Rp 150.000 • Hari kerja berikutnya
                    </div>
                  </div>
                </RadioGroup>
              </div>

              {/* Payment Section */}
              <div className="bg-muted/20 p-8 rounded-none">
                <h2 className="text-lg font-light text-foreground mb-6">
                  Detail Pembayaran
                </h2>

                {!paymentComplete ? (
                  <div className="space-y-6">
                    <div>
                      <Label
                        htmlFor="cardholderName"
                        className="text-sm font-light text-foreground"
                      >
                        Nama Pemegang Kartu *
                      </Label>
                      <Input
                        id="cardholderName"
                        type="text"
                        value={paymentDetails.cardholderName}
                        onChange={(e) =>
                          handlePaymentDetailsChange(
                            "cardholderName",
                            e.target.value
                          )
                        }
                        className="mt-2 rounded-none"
                        placeholder="Nama di kartu"
                      />
                    </div>

                    <div>
                      <Label
                        htmlFor="cardNumber"
                        className="text-sm font-light text-foreground"
                      >
                        Nomor Kartu *
                      </Label>
                      <div className="relative mt-2">
                        <Input
                          id="cardNumber"
                          type="text"
                          value={paymentDetails.cardNumber}
                          onChange={(e) => {
                            const value = e.target.value
                              .replace(/\s/g, "")
                              .replace(/(.{4})/g, "$1 ")
                              .trim();
                            if (value.length <= 19) {
                              handlePaymentDetailsChange("cardNumber", value);
                            }
                          }}
                          className="rounded-none pl-10"
                          placeholder="4242 4242 4242 4242"
                          maxLength={19}
                        />
                        <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label
                          htmlFor="expiryDate"
                          className="text-sm font-light text-foreground"
                        >
                          Tanggal Kadaluarsa *
                        </Label>
                        <Input
                          id="expiryDate"
                          type="text"
                          value={paymentDetails.expiryDate}
                          onChange={(e) => {
                            const value = e.target.value
                              .replace(/\D/g, "")
                              .replace(/(\d{2})(\d{2})/, "$1/$2");
                            if (value.length <= 5) {
                              handlePaymentDetailsChange("expiryDate", value);
                            }
                          }}
                          className="mt-2 rounded-none"
                          placeholder="MM/YY"
                          maxLength={5}
                        />
                      </div>
                      <div>
                        <Label
                          htmlFor="cvv"
                          className="text-sm font-light text-foreground"
                        >
                          CVV *
                        </Label>
                        <Input
                          id="cvv"
                          type="text"
                          value={paymentDetails.cvv}
                          onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, "");
                            if (value.length <= 3) {
                              handlePaymentDetailsChange("cvv", value);
                            }
                          }}
                          className="mt-2 rounded-none"
                          placeholder="123"
                          maxLength={3}
                        />
                      </div>
                    </div>

                    {/* Order Total Summary */}
                    <div className="bg-muted/10 p-6 rounded-none border border-muted-foreground/20 space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Subtotal</span>
                        <span className="text-foreground">
                          Rp {subtotal.toLocaleString("id-ID")}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          Pengiriman
                        </span>
                        <span className="text-foreground">
                          {shipping === 0
                            ? "Gratis"
                            : `Rp ${shipping.toLocaleString("id-ID")}`}
                        </span>
                      </div>
                      <div className="flex justify-between text-lg font-medium border-t border-muted-foreground/20 pt-3">
                        <span className="text-foreground">Total</span>
                        <span className="text-foreground">
                          Rp {total.toLocaleString("id-ID")}
                        </span>
                      </div>
                    </div>

                    <Button
                      onClick={handleCompleteOrder}
                      disabled={
                        isProcessing ||
                        !paymentDetails.cardNumber ||
                        !paymentDetails.expiryDate ||
                        !paymentDetails.cvv ||
                        !paymentDetails.cardholderName
                      }
                      className="w-full rounded-none h-12 text-base"
                    >
                      {isProcessing
                        ? "Memproses..."
                        : `Selesaikan Pesanan • Rp ${total.toLocaleString(
                            "id-ID"
                          )}`}
                    </Button>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                      <Check className="h-8 w-8 text-green-600" />
                    </div>
                    <h3 className="text-xl font-light text-foreground mb-2">
                      Pesanan Selesai!
                    </h3>
                    <p className="text-muted-foreground">
                      Terima kasih atas pembelian Anda. Konfirmasi pesanan Anda
                      telah dikirim ke email Anda.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CheckoutPage;
