import axios from "axios";
import Cookies from "js-cookie";

export async function clearCookies(): Promise<void> {
  Cookies.remove("token");
  window.location.href = "/";
}


