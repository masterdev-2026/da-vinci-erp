import { prisma } from "@davinci/database";

export class ReportService {

  async getGeneral(companyId: string, start: Date, end: Date) {

    const transactions = await prisma.transaction.findMany({
      where: {
        companyId,
        OR: [
          { createdAt: { gte: start, lte: end } },
          { paidAt: { gte: start, lte: end } }
        ]
      }
    });

    let income = 0;
    let expense = 0;
    let paidExpense = 0;

    for (const tx of transactions) {
      const amount = Number(tx.amount);

      if (tx.type === "INCOME") {
        income += amount;
      }

      if (tx.type === "EXPENSE") {
        expense += amount;

        if (tx.status === "PAID") {
          paidExpense += amount;
        }
      }
    }

    return {
      income,
      expense,
      balance: income - expense,
      paidExpense
    };
  }

  async getPurchases(companyId: string, start: Date, end: Date) {

    const expenses = await prisma.transaction.findMany({
      where: {
        companyId,
        type: "EXPENSE",
        createdAt: {
          gte: start,
          lte: end
        }
      }
    });

    const total = expenses.reduce(
      (sum, tx) => sum + Number(tx.amount),
      0
    );

    const paid = expenses.filter(e => e.status === "PAID");

    // tempo médio de pagamento
    const avgDays =
      paid.length === 0
        ? 0
        : paid.reduce((sum, tx) => {
            const diff =
              (new Date(tx.paidAt!).getTime() -
                new Date(tx.createdAt).getTime()) /
              (1000 * 60 * 60 * 24);

            return sum + diff;
          }, 0) / paid.length;

    // mais antiga em aberto
    const oldest = expenses
      .filter(e => e.status !== "PAID")
      .sort(
        (a, b) =>
          new Date(a.createdAt).getTime() -
          new Date(b.createdAt).getTime()
      )[0];

    return {
      totalCount: expenses.length,
      totalAmount: total,
      average: expenses.length ? total / expenses.length : 0,
      pending: expenses.filter(e => e.status !== "PAID").length,
      paid: paid.length,
      avgPaymentDays: Math.round(avgDays),
      oldestOpen: oldest ? oldest.title : null
    };
  }

  //  RANKING POR CATEGORIA (simula "obras")
  async getTopCategories(companyId: string, start: Date, end: Date) {

    const data = await prisma.transaction.groupBy({
      by: ["categoryId"],
      where: {
        companyId,
        type: "EXPENSE",
        createdAt: {
          gte: start,
          lte: end
        }
      },
      _sum: {
        amount: true
      },
      orderBy: {
        _sum: {
          amount: "desc"
        }
      },
      take: 5
    });

    const categories = await prisma.category.findMany({
      where: {
        id: { in: data.map(d => d.categoryId) }
      }
    });

    return data.map(d => {
      const category = categories.find(c => c.id === d.categoryId);

      return {
        name: category?.name || "N/A",
        total: Number(d._sum.amount || 0)
      };
    });
  }
}