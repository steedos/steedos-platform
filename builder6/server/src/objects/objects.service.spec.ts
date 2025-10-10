import { Test, TestingModule } from "@nestjs/testing";
import { ObjectsService } from "./objects.service";

describe("ObjectsService", () => {
  let service: ObjectsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ObjectsService],
    }).compile();

    service = module.get<ObjectsService>(ObjectsService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
