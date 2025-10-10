import { Test, TestingModule } from "@nestjs/testing";
import { AiController } from "./ai.controller";

describe("AiController", () => {
  let controller: AiController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AiController],
    }).compile();

    controller = module.get<AiController>(AiController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
