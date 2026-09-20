import { Test, TestingModule } from "@nestjs/testing";
import { getObject } from "@steedos/objectql";
import { DataService } from "./data.service";

jest.mock("@steedos/objectql", () => ({
  getObject: jest.fn(),
}));

describe("DataService", () => {
  let service: DataService;
  let obj: {
    find: jest.Mock;
    count: jest.Mock;
    insert: jest.Mock;
    findOne: jest.Mock;
    update: jest.Mock;
    delete: jest.Mock;
  };

  const userSession = { userId: "u1", spaceId: "s1" };

  beforeEach(async () => {
    obj = {
      find: jest.fn(),
      count: jest.fn(),
      insert: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };
    (getObject as jest.Mock).mockReturnValue(obj);

    const module: TestingModule = await Test.createTestingModule({
      providers: [DataService],
    }).compile();

    service = module.get<DataService>(DataService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  // 以下用例锁定 objectql 的方法签名：
  //   findOne(id, query, userSession) / update(id, doc, userSession) / delete(id, userSession)
  // userSession 一旦错位，objectql 的 callAdapter 会因 _.isEmpty(userSession) 成立
  // 而跳过对象权限、租户过滤与记录级过滤。
  describe("findOne", () => {
    it("passes userSession as the third argument", async () => {
      await service.findOne("test", "r1", userSession);
      expect(obj.findOne).toHaveBeenCalledWith("r1", {}, userSession);
    });
  });

  describe("update", () => {
    it("passes doc and userSession in order", async () => {
      const doc = { name: "Jack" };
      await service.update("test", "r1", doc, userSession);
      expect(obj.update).toHaveBeenCalledWith("r1", doc, userSession);
    });
  });

  describe("delete", () => {
    it("calls delete, not update", async () => {
      await service.delete("test", "r1", userSession);
      expect(obj.delete).toHaveBeenCalledWith("r1", userSession);
      expect(obj.update).not.toHaveBeenCalled();
    });
  });
});
