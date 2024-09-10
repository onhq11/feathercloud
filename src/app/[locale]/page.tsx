import { getTranslations } from "next-intl/server";
import TableHead from "@/components/Table/TableHead";
import TableBody from "@/components/Table/TableBody";
import { GET } from "@/components/Api/Api";
import Table from "@/components/Table/Table";

export default async function List() {
  const t = await getTranslations();
  const response = (await GET("/api/files")) || {};

  const columns = [
    {
      value: "file",
      renderer: (row: any) => {
        return <img src={row.image} alt={row.name} />;
      },
    },
    { value: "name" },
    { value: "size" },
    { value: "lastModified" },
  ];

  return (
    <div>
      <h1>{t("title")}</h1>
      <Table>
        <TableHead columns={columns} />
        <TableBody columns={columns} data={response.data} />
      </Table>
    </div>
  );
}
