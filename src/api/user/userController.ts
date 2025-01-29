import type { Request, RequestHandler, Response } from "express";

import { userService } from "@/api/user/userService";
import { handleServiceResponse } from "@/common/utils/httpHandlers";
import { User } from "@/models/User";
import { logger } from "@/server";

class UserController {
  public getUsers: RequestHandler = async (_req, res) => {
    const serviceResponse = await userService.findAll();
    return handleServiceResponse(serviceResponse, res);
  };

  public getUser: RequestHandler = async (req, res) => {
    const id = Number.parseInt(req.params.id as string, 10);
    const serviceResponse = await userService.findById(id);
    return handleServiceResponse(serviceResponse, res);
  };

  public testModel: RequestHandler = async (_req, res) => {
    const user = new User({
      email: "paulo@example.com",
      firstName: "Paulo",
      lastName: "Example",
      password: "123",
      phone: "123456789",
      payment: {
        cardNumber: "1234 5678 1234 5678",
        expiresAt: new Date("2028-12-31"),
      },
    });

    const user2 = new User({ email: "test@test.com" });
    user2.fullName = "Test User";

    logger.info(`First name: ${user2.firstName}`);
    logger.info(`Last name: ${user2.lastName}`);
    logger.info(`Full name: ${user2.fullName}`);

    logger.info(`Is pro: ${user.isPro}`);
    logger.info(`Is pro 2: ${user2.isPro}`);

    res.json(user);
  };
}

export const userController = new UserController();
