import * as zod from "zod";

const userConnectionSchema = zod.object({
  sender_id: zod
    .string({
      required_error: "sender_id is required",
      invalid_type_error: "sender_id must be a string",
    })
    .uuid({ message: "sender_id must be a valid UUID" }),
  receiver_id: zod
    .string({
      required_error: "receiver_id is required",
      invalid_type_error: "receiver_id must be a string",
    })
    .uuid({ message: "receiver_id must be a valid UUID" }),
  status: zod.enum(["pending", "accepted", "rejected", "blocked"], {
    errorMap: () => ({
      message: "status must be one of: pending, accepted, rejected, blocked",
    }),
  }),
});

export default userConnectionSchema;
