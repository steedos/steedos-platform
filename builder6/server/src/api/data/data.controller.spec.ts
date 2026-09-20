import { getSessionByUserId } from "@steedos/auth";
import { DataController } from "./data.controller";
import { DataService } from "./data.service";

jest.mock("@steedos/auth", () => ({
  getSessionByUserId: jest.fn(),
}));

describe("DataController", () => {
  let controller: DataController;
  let dataService: { delete: jest.Mock };
  let res: { status: jest.Mock; send: jest.Mock };

  const req = { user: { user: "u1", space: "s1" } } as any;
  const userSession = { userId: "u1", spaceId: "s1" };

  beforeEach(() => {
    (getSessionByUserId as jest.Mock).mockResolvedValue(userSession);
    dataService = { delete: jest.fn() };
    res = { status: jest.fn(), send: jest.fn() };
    res.status.mockReturnValue(res);
    res.send.mockReturnValue(res);
    controller = new DataController(dataService as unknown as DataService);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  // obj.delete() 的返回值取决于驱动：mongo 驱动返回 deletedCount（number），
  // typeorm 驱动无返回值。这里把几种形态都钉住，避免删除成功却误报 404，
  // 或记录不存在却回 200。
  describe("remove", () => {
    it("returns 200 when the mongo driver reports a deleted record", async () => {
      dataService.delete.mockResolvedValue(1);
      await controller.remove("test", "r1", req, res as any);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith({ deleted: true, _id: "r1" });
    });

    it("returns 404 when the mongo driver reports no deleted record", async () => {
      dataService.delete.mockResolvedValue(0);
      await controller.remove("test", "r1", req, res as any);
      expect(res.status).toHaveBeenCalledWith(404);
    });

    it("returns 200 for a { deletedCount } result object", async () => {
      dataService.delete.mockResolvedValue({ deletedCount: 1 });
      await controller.remove("test", "r1", req, res as any);
      expect(res.status).toHaveBeenCalledWith(200);
    });

    it("returns 404 for a { deletedCount: 0 } result object", async () => {
      dataService.delete.mockResolvedValue({ deletedCount: 0 });
      await controller.remove("test", "r1", req, res as any);
      expect(res.status).toHaveBeenCalledWith(404);
    });

    it("returns 200 when the driver reports nothing", async () => {
      dataService.delete.mockResolvedValue(undefined);
      await controller.remove("test", "r1", req, res as any);
      expect(res.status).toHaveBeenCalledWith(200);
    });

    it("forwards the user session to the service", async () => {
      dataService.delete.mockResolvedValue(1);
      await controller.remove("test", "r1", req, res as any);
      expect(dataService.delete).toHaveBeenCalledWith("test", "r1", userSession);
    });
  });
});
