import { NextApiHandler } from "next";

const handler: NextApiHandler = async (req, res) => {
  const { secret, route } = req.body;
  if (!secret)
    return res.status(401).json({
      error: "No secret provided",
    });
  if (!route)
    return res.status(400).json({
      error: "No Route provided to revalidate",
    });
  if (process.env.SECRET !== secret)
    return res.status(401).json({
      error: "Invalid secret",
    });
  try {
    await res.revalidate(route);
    return res.status(200).json({
      revalidated: true,
    });
  } catch (err: any) {
    return res.status(500).json({
      error: err.message,
    });
  }
};
export default handler;