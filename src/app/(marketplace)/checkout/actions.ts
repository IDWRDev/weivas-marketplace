"use server";

export async function placeOrder(formData:FormData){
  void formData;
  throw new Error("Online checkout is not active until a verified payment provider and webhook are connected.");
}
