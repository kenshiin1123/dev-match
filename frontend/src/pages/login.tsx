import PageContainer from "@/components/page-container";
import {
  Form,
  useNavigate,
  useNavigation,
  type ActionFunction,
} from "react-router-dom";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";
import { Loader2Icon } from "lucide-react";
import { useActionData } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { userActions } from "@/store/user-reducer";
import { getDataFromToken } from "@/util/auth";
export default function Login() {
  const navigation = useNavigation();
  const navigate = useNavigate();
  const isSubmitting = navigation.state === "submitting";
  const successfullyLoggedIn = useActionData();
  const dispatch = useDispatch();

  useEffect(() => {
    // The purpose of this is to set the role in the RTK store
    if (successfullyLoggedIn) {
      const tokenData = getDataFromToken();
      dispatch(userActions.setRole(tokenData.role));
      navigate("/");
    }
  }, [successfullyLoggedIn, dispatch, navigate]);

  return (
    <PageContainer>
      <div className={cn("flex flex-col gap-6 max-w-120 mx-auto")}>
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-xl">Welcome back</CardTitle>
            <CardDescription>Login to your Dev Match account</CardDescription>
          </CardHeader>
          <CardContent>
            <Form method="POST">
              <div className="grid gap-6">
                {/* <OtherLoginMethod /> */}
                <div className="grid gap-6">
                  <div className="grid gap-3">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" name="email" required />
                  </div>
                  <div className="grid gap-3">
                    <div className="flex items-center">
                      <Label htmlFor="password">Password</Label>
                      {/* <a
                        href="#"
                        className="ml-auto text-sm underline-offset-4 hover:underline"
                      >
                        Forgot your password?
                      </a> */}
                    </div>
                    <Input
                      id="password"
                      type="password"
                      name="password"
                      required
                    />
                  </div>
                  <Button
                    type="submit"
                    className={`"w-full" ${
                      isSubmitting ? "animate-pulse" : ""
                    }`}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2Icon className="animate-spin" /> Logging in
                      </>
                    ) : (
                      "Login"
                    )}
                  </Button>
                </div>
                <div className="text-center text-sm">
                  Don&apos;t have an account?{" "}
                  <Link to="/signup" className="underline underline-offset-4">
                    Sign up
                  </Link>
                </div>
              </div>
            </Form>
          </CardContent>
        </Card>
        {/* <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
          By clicking continue, you agree to our{" "}
          <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
        </div> */}
      </div>
    </PageContainer>
  );
}

export const action: ActionFunction = async ({ request }) => {
  const { VITE_API_BASE_URL } = import.meta.env;
  const formData = await request.formData();
  const payload = {
    email: formData.get("email"),
    password: formData.get("password"),
  };

  const response = await fetch(VITE_API_BASE_URL + "/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const { data, message, success } = await response.json();

  if (!success) {
    data?.errors.forEach((error: string) => {
      toast.error(error);
    });

    // Fallback if data.errors are not available
    if (!data) {
      toast.error(message);
    }

    return;
  }

  // Store token in localstorage
  localStorage.setItem("token", data.token);
  toast.success(message);

  // Return this data to verify in the login that the user has successfully logged in
  // And the token has already been saved
  return success;
};
