function isMissingCustomerIdColumn(error) {
  const code = String(error?.code || "");
  const message = String(error?.message || "").toLowerCase();
  const details = String(error?.details || "").toLowerCase();

  if (code === "42703") return true;
  return (
    (message.includes("customer_id") || details.includes("customer_id")) &&
    (message.includes("column") || details.includes("column"))
  );
}

export async function insertServiceRequest(supabase, row, customerId) {
  const withCustomerId = {
    ...row,
    customer_id: customerId || null,
  };

  const firstAttempt = await supabase.from("service_requests").insert([withCustomerId]);
  if (!firstAttempt.error) return firstAttempt;

  if (!isMissingCustomerIdColumn(firstAttempt.error)) {
    return firstAttempt;
  }

  const { customer_id, ...withoutCustomerId } = withCustomerId;
  return supabase.from("service_requests").insert([withoutCustomerId]);
}
