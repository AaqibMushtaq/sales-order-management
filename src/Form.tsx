import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";

type FormValueTypes = {
  firstName: string;
  lastName: string;
  email: string;
};

const form = () => {
  const { register, handleSubmit } = useForm<FormValueTypes>();
  const onSubmit: SubmitHandler<FormValueTypes> = (data) => console.log(data);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <label>
        {" "}
        First Name:
        <input {...register("firstName")} /> <br />
      </label>
      <label>
        Last Name:
        <input {...register("lastName")} /> <br />
      </label>
      <label>
        {" "}
        Email:
        <input type="email" {...register("email")} /> <br />
      </label>
      <input type="submit" />
    </form>
  );
};

export default form;
