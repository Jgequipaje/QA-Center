import { APIRequestContext, APIResponse } from "@playwright/test";
import { QAItemEdit, type QAItem } from "../../../utils/models/qaIssue.model";

export class QAItemsClient {
  constructor(private readonly request: APIRequestContext) {
    this.request = request;
  }

  public async getQAItems(
    params?: Record<string, string | number | boolean>
  ): Promise<APIResponse> {
    return await this.request.get("/api/qa-items", { params });
  }

  public async getQAItem(id: string): Promise<APIResponse> {
    return await this.request.get(`/api/qa-items/${id}`);
  }

  public async createItem(payload: QAItem): Promise<APIResponse> {
    return await this.request.post("/api/qa-items", {
      data: payload,
    });
  }

  public async createItemRaw(payload: Record<string, unknown>): Promise<APIResponse> {
    return await this.request.post("/api/qa-items", {
      data: payload,
    });
  }

  public async editItemById(id: string, payload: QAItemEdit): Promise<APIResponse> {
    return await this.request.patch(`/api/qa-items/${id}`, {
      data: payload,
    });
  }

  public async deleteItemById(id: string): Promise<APIResponse> {
    return await this.request.delete(`/api/qa-items/${id}`);
  }

  public async deleteAllItems(): Promise<APIResponse> {
    const allTestDataRes = await this.getQAItems();
    const allTestDataBody = await allTestDataRes.json();
    for (const item of allTestDataBody) {
      await this.deleteItemById(item.id);
    }
    return allTestDataRes;
  }
}
