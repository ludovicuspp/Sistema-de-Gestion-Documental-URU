# Contexto de build: carpeta backend (padre de support y commons).
# Ejemplo: docker build -f support/Dockerfile .

FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS base
WORKDIR /app
EXPOSE 8080
EXPOSE 443

FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src
COPY ["commons/Sidae.Commons.csproj", "commons/"]
COPY ["support/Sidae.Support/Sidae.Support.csproj", "support/Sidae.Support/"]
RUN dotnet restore "support/Sidae.Support/Sidae.Support.csproj"
COPY . .
WORKDIR "/src/."
RUN dotnet build "support/Sidae.Support/Sidae.Support.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "support/Sidae.Support/Sidae.Support.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "Sidae.Support.dll"]
